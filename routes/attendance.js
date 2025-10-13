
const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const student = require("../models/student");

const SubjectDetailsController = require("../controllers/DashboardController");
// routes/attendance.js
// const attendanceController=require("../controllers//")
 
router.get("/report", (req, res) => {
  res.render("Date-Wise_Attendence"); // Renders EJS form page
});

// Generate report after form submit
router.get("/report/result", SubjectDetailsController.getSubjectAttendanceReport);

router.put("/edit", SubjectDetailsController.editAttendance);
// >>>>>>> eb02a28 (Teacher can edit Attendance)
router.get('/lab-students', async (req, res) => {
    try {
        const { className, year, semester, sectionName } = req.query;

        // Find the class document based on the provided criteria
        const classInfo = await student.findOne({
            className,
            year,
            semester,
            sectionName,
        });

        if (!classInfo) {
            return res.status(404).json({ message: 'Class not found' });
        }
        console.log('reached hgere',classInfo.batches);
        
        // Return the full batches array
        res.status(200).json({ batches: classInfo.batches });

    } catch (error) {
        console.error('Error fetching lab batches and students:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.get("/attendance/:branch/:year/:semester/:section", async (req, res) => {
  try {
    console.log("📥 Attendance Report Route Reached");

    const { branch, year, semester, section } = req.params;
    console.log(`🔎 Fetching data for: ${branch} - ${year} - ${semester} - ${section}`);

    // 🔹 Find the class document
    const classDoc = await StudentAttendance.findOne({
      branchName: branch,
      year,
      semester,
      sectionName: section
    });

    if (!classDoc) {
      console.log("⚠ No class found for given filters");
      return res.render("showReport", {
        students: [],
        subjects: [],
        branchName: branch,
        year,
        semester,
        sectionName: section,
        message: "No attendance data found for this class."
      });
    }

    const students = classDoc.students || [];
    const allSubjectsSet = new Map(); // subject -> {subjectCode, subjectName}

    const studentsWithSummary = students.map((student) => {
      // Calculate subject totals & percentages
      const subjectTotals = (student.subjectTotals || []).map((sub) => {
        // Collect unique subject for global list
        if (!allSubjectsSet.has(sub.subject)) {
          allSubjectsSet.set(sub.subject, {
            subject: sub.subject,
            subjectCode: sub.subject.split(" - ")[0],
            subjectName: sub.subject.split(" - ")[1] || ""
          });
        }

        return {
          subject: sub.subject,
          totalClass: sub.totalClass,
          totalPresent: sub.totalPresent,
          totalAbsent: sub.totalAbsent,
          percentage:
            sub.totalClass > 0
              ? ((sub.totalPresent / sub.totalClass) * 100).toFixed(2)
              : "0.00"
        };
      });

      // Overall percentage
      const overallPercentage =
        student.totalClass > 0
          ? ((student.totalPresent / student.totalClass) * 100).toFixed(2)
          : "0.00";

      return {
        enrollmentNo: student.enrollmentNo,
        name: student.name || "N/A",
        totalClass: student.totalClass,
        totalPresent: student.totalPresent,
        totalAbsent: student.totalAbsent,
        overallPercentage,
        subjectTotals
      };
    });

    // Convert Map -> Array
    const subjects = Array.from(allSubjectsSet.values());

    console.log("✅ Attendance data prepared successfully");
    console.log(subjects);
    
    res.render("showReport", {
      students: studentsWithSummary,
      subjects,
      branchName: branch,
      year,
      semester,
      sectionName: section
    });

  } catch (err) {
    console.error("❌ Error fetching attendance:", err);
    res.status(500).send("Error fetching attendance data");
  }
});

// module.exports = router;

// module.exports = router;xsfss


// module.exports = router;

router.post('/showList', async (req, res) => {
  try {
    const { className, sectionName, year, semester, subject, date } = req.body;

    // Fetch class with students
    const classData = await student.findOne({ className, sectionName, year, semester });

    if (!classData) {
      // If class not found, send a JSON error response
      return res.status(404).json({ students: [], message: 'No students found for this class.' });
    }

    // Send a JSON response with the students list
    res.status(200).json({
      students: classData.students,
      message: 'Students list fetched successfully.'
    });
  } catch (err) {
    console.error(err);
    // Send a JSON error response on server error
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const Attendance = require("../models/Attendance");
// const Student = require("../models/StudentAttendanceSchema");
const StudentAttendance = require("../models/StudentAttendanceSchema");
// 📌 Submit Attendance
// Use this router.post("/submit-attendance", ...) to replace your current handler
router.post("/submit-attendance", async (req, res) => {
    try {
        const { className, year, semester, sectionName, subject, attendance, date } = req.body;
        const branchName = className;
        console.log('readh', className, year, semester, sectionName, subject, attendance, date);

        // This part of the code is also a potential source of error if `attendance` is not a string
        const parsedAttendance =
            typeof attendance === "string" ? JSON.parse(attendance) : attendance;

        if (!parsedAttendance || Object.keys(parsedAttendance).length === 0) {
            return res.status(400).json({ message: "No attendance data provided" });
        }

        const attendanceDate = date ? new Date(date) : new Date();
        const isoDateStr = attendanceDate.toISOString().slice(0, 10);

        let classDoc = await StudentAttendance.findOne({
            branchName,
            year,
            semester,
            sectionName,
        });

        if (!classDoc) {
            classDoc = new StudentAttendance({
                branchName,
                year,
                semester,
                sectionName,
                students: [],
            });
        }

        for (const [enrollmentNo, status] of Object.entries(parsedAttendance)) {
            if (!enrollmentNo) continue;

            let student = classDoc.students.find((s) => s.enrollmentNo === enrollmentNo);
            if (!student) {
                student = classDoc.students.create({
                    enrollmentNo,
                    attendance: [],
                    totalClass: 0,
                    totalPresent: 0,
                    totalAbsent: 0,
                    subjectTotals: [],
                });
                classDoc.students.push(student);
            }

            let attendanceRecord = student.attendance.find(
                (a) => new Date(a.date).toISOString().slice(0, 10) === isoDateStr
            );

            if (!attendanceRecord) {
                attendanceRecord = student.attendance.create({
                    date: attendanceDate,
                    subjects: [],
                });
                student.attendance.push(attendanceRecord);
            }

            let subjectEntry = attendanceRecord.subjects.find((s) => s.subject === subject);
            if (!subjectEntry) {
                attendanceRecord.subjects.push({ subject, status });
            } else {
                subjectEntry.status = status;
            }

            let subjectTotal = student.subjectTotals.find((st) => st.subject === subject);
            if (!subjectTotal) {
                subjectTotal = student.subjectTotals.create({
                    subject,
                    totalClass: 0,
                    totalPresent: 0,
                    totalAbsent: 0,
                });
                student.subjectTotals.push(subjectTotal);
            }

            student.totalClass += 1;
            subjectTotal.totalClass += 1;
            if (status === "Present") {
                student.totalPresent += 1;
                subjectTotal.totalPresent += 1;
            } else {
                student.totalAbsent += 1;
                subjectTotal.totalAbsent += 1;
            }

            classDoc.markModified("students");
            classDoc.markModified("students.$.attendance");
            classDoc.markModified("students.$.subjectTotals");
        }

        await classDoc.save({ validateModifiedOnly: true });

        // Change this line to send a JSON response
        res.status(200).json({ message: "Attendance saved successfully!" });

    } catch (err) {
        console.error("❌ Error saving attendance:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});



// module.exports = router;



module.exports = router;