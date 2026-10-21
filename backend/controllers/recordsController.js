const MedicalRecord = require("../models/MedicalRecord");
const Prescription = require("../models/Prescription");
const LabReport = require("../models/LabReport");
const axios = require("axios");

// GET /api/v1/medical-records/my
exports.getMyMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user.id })
      .populate("doctor", "fullName")
      .sort({ createdAt: -1 });

    const formatted = records.map((r) => ({
      _id: r._id,
      diagnosis: r.diagnosis,
      doctorName: r.doctor?.fullName || "Doctor",
      date: r.date,
      notes: r.notes,
    }));

    res.status(200).json({ success: true, records: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET /api/v1/medical-records/:id
exports.getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id).populate("doctor", "fullName");
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    if (record.patient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    res.status(200).json({ success: true, record });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET /api/v1/prescriptions/my
exports.getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate("doctor", "fullName")
      .sort({ createdAt: -1 });

    const formatted = prescriptions.map((p) => ({
      _id: p._id,
      doctorName: p.doctor?.fullName || "Doctor",
      date: p.date,
      medicines: p.medicines,
    }));

    res.status(200).json({ success: true, prescriptions: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET /api/v1/lab-reports/my
exports.getMyLabReports = async (req, res) => {
  try {
    const reports = await LabReport.find({ patient: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET /api/v1/lab-reports/:id/download
exports.downloadLabReport = async (req, res) => {
  try {
    const report = await LabReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    if (report.patient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Fetch the file from Cloudinary and stream it back as a download
    const response = await axios.get(report.fileUrl, { responseType: "stream" });
    res.setHeader("Content-Disposition", `attachment; filename="${report.fileName}"`);
    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not download report", error: error.message });
  }
};