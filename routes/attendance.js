
const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const student = require("../models/student");

// Route to show student list for attendance
router.post('/showList', async (req, res) => {
  try {
    const { className, sectionName, year, subject, date } = req.body;

    // Fetch class with students
    const classData = await student.findOne({ className, sectionName, year });

    if (!classData) {
      return res.render('store/markAttendence', {
        IsLoggedIn: true,
        students: [],
        pageTitle: 'Mark Attendance',
        currentPage: 'Mark Attendance',
        selectedClass: className,
        selectedSection: sectionName,
        selectedYear: year,
        selectedSubject: subject,
        user: req.session.user || {},
        selectedDate: date,
        toastMessage: null
      });
    }

    // Render page with students list
    res.render('store/markAttendence', {
      pageTitle: 'Mark Attendance',
      IsLoggedIn: true,
       currentPage: 'Mark Attendance',
        user: req.session.user || {},
      students: classData.students,
      selectedClass: className,
      selectedSection: sectionName,
      selectedYear: year,
      selectedSubject: subject,
      selectedDate: date,
      toastMessage: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const Attendance = require("../models/Attendance");
// const Student = require("../models/StudentAttendanceSchema");
const StudentAttendance = require("../models/StudentAttendanceSchema");
// 📌 Submit Attendance
router.post("/submit-attendance", async (req, res) => {
  try {
    const { BranchName, year, sectionName, subject, attendance, date } = req.body;

    // Parse attendance data
    const parsedAttendance =
      typeof attendance === "string" ? JSON.parse(attendance) : attendance;

    if (!parsedAttendance || Object.keys(parsedAttendance).length === 0) {
      return res.status(400).json({ message: "No attendance data provided" });
    }

    const totalStudents = Object.keys(parsedAttendance).length;

    const presentStudents = Object.keys(parsedAttendance)
      .filter((enrollmentNo) => parsedAttendance[enrollmentNo] === "Present")
      .map((enrollmentNo) => ({ enrollmentNo }));

    // ---------------------------
    // 1️⃣ Save to Attendance collection
    // ---------------------------
    const newAttendance = new Attendance({
      branchName: BranchName,
      year,
      sectionName,
      subject,
      date: date || new Date(),
      totalStudents,
      totalPresent: presentStudents.length,
      totalAbsent: totalStudents - presentStudents.length,
      presentStudents
    });

    // ---------------------------
    // 2️⃣ Update each student's record
    // ---------------------------
    const updatePromises = Object.entries(parsedAttendance).map(
  async ([enrollmentNo, status]) => {
    // Step 1: Ensure student document exists
    await StudentAttendance.updateOne(
      { enrollmentNo },
      {
        $setOnInsert: {
          enrollmentNo,
          className: BranchName,
          sectionName,
          year,
          attendance: [], 
          subjectTotals: [] // ✅ initialize array
        }
      },
      { upsert: true }
    );

    // Step 2: Ensure date entry exists
    await StudentAttendance.updateOne(
      { enrollmentNo, "attendance.date": { $ne: date } },
      {
        $push: {
          attendance: { date, subjects: [] }
        }
      }
    );

    // Step 3: Push subject into that date + update overall totals
    await StudentAttendance.updateOne(
      { enrollmentNo, "attendance.date": date },
      {
        $push: {
          "attendance.$.subjects": { subject, status }
        },
        $inc: {
          totalClass: 1,
          totalPresent: status === "Present" ? 1 : 0,
          totalAbsent: status === "Absent" ? 1 : 0
        }
      }
    );

    // Step 4: Update subject-wise totals
    await StudentAttendance.updateOne(
      { enrollmentNo, "subjectTotals.subject": subject },
      {
        $inc: {
          "subjectTotals.$.totalClass": 1,
          "subjectTotals.$.totalPresent": status === "Present" ? 1 : 0,
          "subjectTotals.$.totalAbsent": status === "Absent" ? 1 : 0
        }
      }
    );

    // Step 5: If subjectTotals entry doesn't exist → create it
    await StudentAttendance.updateOne(
      { enrollmentNo, "subjectTotals.subject": { $ne: subject } },
      {
        $push: {
          subjectTotals: {
            subject,
            totalClass: 1,
            totalPresent: status === "Present" ? 1 : 0,
            totalAbsent: status === "Absent" ? 1 : 0
          }
        }
      }
    );
  }
);


// Save attendance + student updates together
await Promise.all([newAttendance.save(), ...updatePromises]);
    const toastMessage = {type: 'success', text: 'Attendance saved successfully!.'};
    req.session.toastMessage = null;
    res.render("store/markAttendence", { 
      selectedClass: '',
      selectedSection: '',
      selectedYear: '',
      selectedSubject: '',
      selectedDate: '',
      pageTitle: "Mark Attendance",
      currentPage: "Mark Attendance",
      IsLoggedIn: true,
      user: req.session.user || {},
      students: [],
      toastMessage: toastMessage
    });
  } catch (err) {
    console.error("❌ Error saving attendance:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// module.exports = router;



module.exports = router;