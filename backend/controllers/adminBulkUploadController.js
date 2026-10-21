const csv = require("csv-parser");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const Department = require("../models/Department.js");

// POST /api/v1/admin/doctors/bulk-upload  (expects multer to have parsed req.file as CSV)
exports.bulkUploadDoctors = async (req, res, next) => {
  try {
    if (!req.file) {
      res.statusCode = 400;
      return next(new Error("Please upload a CSV file."));
    }

    const rows = [];
    const filePath = req.file.path;

    // Parse the CSV file into rows
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", resolve)
        .on("error", reject);
    });

    const results = {
      added: [],
      skipped: [],
      failed: [],
    };

    const salt = await bcrypt.genSalt(10);

    for (const row of rows) {
      // Expected CSV columns: fullName, email, phone, specialization, department, password (optional)
      const fullName = row.fullName?.trim();
      const email = row.email?.trim()?.toLowerCase();
      const phone = row.phone?.trim();
      const specialization = row.specialization?.trim() || "";
      const department = row.department?.trim() || "";
      const password = row.password?.trim() || "Doctor@123"; // default if not provided

      if (!fullName || !email || !phone) {
        results.failed.push({ row, reason: "Missing required fields (fullName, email, phone)" });
        continue;
      }

      const existing = await User.findOne({ email });
      if (existing) {
        results.skipped.push({ email, reason: "Email already exists" });
        continue;
      }

      // Auto-create department if it doesn't exist yet
      if (department) {
        const deptExists = await Department.findOne({ name: department });
        if (!deptExists) {
          await Department.create({ name: department });
        }
      }

      const hashedPassword = await bcrypt.hash(password, salt);

      const doctor = await User.create({
        fullName,
        email,
        phone,
        password: hashedPassword,
        role: "doctor",
        specialization,
        department,
      });

      results.added.push({ fullName: doctor.fullName, email: doctor.email });
    }

    // Clean up the temporary uploaded file
    fs.unlink(filePath, () => {});

    res.status(200).json({
      success: true,
      message: `${results.added.length} doctor(s) added, ${results.skipped.length} skipped, ${results.failed.length} failed.`,
      results,
    });
  } catch (error) {
    next(error);
  }
};