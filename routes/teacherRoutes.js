const express = require("express");
const router = express.Router();
const StudentAttendance = require("../models/StudentAttendanceSchema");

// Get all students in a class (branch/year/section)
router.get("/students", async (req, res) => {
  try {
    const { year, sectionName } = req.query;

    // Find students grouped by year + section
    const students = await StudentAttendance.find({ year, sectionName }).select("enrollmentNo year sectionName");

    if (!students || students.length === 0) {
      return res.render("studentList", { error: "No students found", students: [] });
    }

    res.render("studentList", {
      classInfo: { year, section: sectionName },
      students
    });
  } catch (err) {
    console.error(err);
    res.render("studentList", { error: "Server Error", students: [] });
  }
});

// Get detailed attendance report of a student
router.get("/attendance/:enrollmentNo", async (req, res) => {
  try {
    const { enrollmentNo } = req.params;
    const studentAttendance = await StudentAttendance.findOne({ enrollmentNo });

    if (!studentAttendance) {
      return res.render("studentAttendance", { error: "Attendance not found" });
    }

    res.render("studentAttendance", { attendance: studentAttendance });
  } catch (err) {
    console.error(err);
    res.render("studentAttendance", { error: "Server Error" });
  }
});

module.exports = router;
