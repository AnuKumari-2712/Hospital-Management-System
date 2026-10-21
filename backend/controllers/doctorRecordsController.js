const MedicalRecord = require("../models/MedicalRecord");
const Prescription = require("../models/Prescription");
const LabReport = require("../models/LabReport");
const cloudinary = require("../config/cloudinary.js");

// GET /api/v1/doctor/medical-records?patientId=xyz
exports.getDoctorMedicalRecords = async (req, res, next) => {
  try {
    const { patientId } = req.query;
    const filter = { doctor: req.user.id };
    if (patientId) filter.patient = patientId;

    const records = await MedicalRecord.find(filter)
      .populate("patient", "fullName")
      .sort({ createdAt: -1 });

    const formatted = records.map((r) => ({
      _id: r._id,
      diagnosis: r.diagnosis,
      notes: r.notes,
      patientName: r.patient?.fullName || "Patient",
      date: r.date,
    }));

    res.status(200).json({ success: true, records: formatted });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/doctor/medical-records
exports.createMedicalRecord = async (req, res, next) => {
  try {
    const { patientId, diagnosis, notes } = req.body;

    if (!patientId || !diagnosis) {
      res.statusCode = 400;
      return next(new Error("Patient and diagnosis are required."));
    }

    const record = await MedicalRecord.create({
      patient: patientId,
      doctor: req.user.id,
      diagnosis,
      notes: notes || "",
      date: new Date().toISOString().split("T")[0],
    });

    res.status(201).json({
      success: true,
      message: "Record created.",
      record: {
        _id: record._id,
        diagnosis: record.diagnosis,
        notes: record.notes,
        date: record.date,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/doctor/prescriptions
exports.createPrescription = async (req, res, next) => {
  try {
    const { patientId, medicines } = req.body;

    if (!patientId || !medicines || medicines.length === 0) {
      res.statusCode = 400;
      return next(new Error("Patient and at least one medicine are required."));
    }

    const prescription = await Prescription.create({
      patient: patientId,
      doctor: req.user.id,
      medicines,
      date: new Date().toISOString().split("T")[0],
    });

    res.status(201).json({ success: true, message: "Prescription created.", prescription });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/doctor/lab-reports  (expects multer to have parsed req.file)
exports.uploadLabReport = async (req, res, next) => {
  try {
    const { patientId, testName } = req.body;

    if (!patientId || !testName || !req.file) {
      res.statusCode = 400;
      return next(new Error("Patient, test name, and file are required."));
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "hms_lab_reports",
      resource_type: "auto",
    });

    const report = await LabReport.create({
      patient: patientId,
      testName,
      date: new Date().toISOString().split("T")[0],
      fileUrl: uploadResult.secure_url,
      fileName: req.file.originalname,
    });

    res.status(201).json({ success: true, message: "Report uploaded.", report });
  } catch (error) {
    next(error);
  }
};