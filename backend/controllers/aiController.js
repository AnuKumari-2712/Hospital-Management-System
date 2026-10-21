const anthropic = require("../config/anthropic.js");
const MedicalRecord = require("../models/MedicalRecord");

// POST /api/v1/ai/symptom-checker
exports.checkSymptoms = async (req, res, next) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.trim().length < 5) {
      res.statusCode = 400;
      return next(new Error("Please describe your symptoms in more detail."));
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 500,
      system:
        "You are a medical triage assistant for a hospital app. Given a patient's described symptoms, suggest 2-4 possible general conditions (NOT a diagnosis) and recommend which hospital department they should book an appointment with from this list: Cardiology, Dermatology, Orthopedics, Pediatrics, Neurology, Gynecology, ENT, Psychiatry, General Medicine, Ophthalmology, Urology, Endocrinology, Nephrology, Oncology, Pulmonology, Gastroenterology, Rheumatology, Dentistry, General Surgery. Always include a clear disclaimer that this is not a medical diagnosis and they should consult a doctor. Respond ONLY in valid JSON with this exact shape: {\"possibleConditions\": [\"...\"], \"recommendedDepartment\": \"...\", \"urgency\": \"low|medium|high\", \"disclaimer\": \"...\"}. No markdown, no extra text — JSON only.",
      messages: [{ role: "user", content: symptoms }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    res.status(200).json({ success: true, result });
  } catch (error) {
    if (error.message?.includes("JSON")) {
      res.statusCode = 502;
      return next(new Error("AI response could not be processed. Please try again."));
    }
    next(error);
  }
};

// POST /api/v1/ai/chatbot
exports.chatbotReply = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      res.statusCode = 400;
      return next(new Error("Message is required."));
    }

    const conversationHistory = (history || []).map((h) => ({
      role: h.sender === "user" ? "user" : "assistant",
      content: h.text,
    }));

    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 400,
      system:
        "You are a friendly, helpful health information assistant for a hospital's patient app called MediCare+. Answer general health, wellness, and hospital-navigation questions (like how to book an appointment, what a department treats, general wellness tips) in a warm, clear, concise way (2-4 sentences typically). You are NOT a doctor — never diagnose, never prescribe medication or dosages, and always suggest booking an appointment with a doctor for anything specific to their personal health condition. If asked something outside health/hospital topics, politely redirect to hospital-related topics.",
      messages: [...conversationHistory, { role: "user", content: message }],
    });

    const textBlock = response.content.find((block) => block.type === "text");

    res.status(200).json({ success: true, reply: textBlock.text });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/ai/prescription-summary  (Doctor generates a patient-friendly summary)
exports.summarizeRecord = async (req, res, next) => {
  try {
    const { diagnosis, notes } = req.body;

    if (!diagnosis) {
      res.statusCode = 400;
      return next(new Error("Diagnosis is required to generate a summary."));
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 300,
      system:
        "You are a medical documentation assistant. Given a doctor's diagnosis and clinical notes, rewrite them into a short, warm, plain-language summary (3-5 sentences) that a patient with no medical background can easily understand. Avoid jargon. Do not add any medical information that wasn't in the original notes.",
      messages: [
        {
          role: "user",
          content: `Diagnosis: ${diagnosis}\nClinical notes: ${notes || "None provided"}`,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");

    res.status(200).json({ success: true, summary: textBlock.text });
  } catch (error) {
    next(error);
  }
};