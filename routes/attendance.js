
const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const student = require("../models/student");

const SubjectDetailsController = require("../controllers/DashboardController");
// routes/attendance.js
// const attendanceController=require("../controllers//")

router.get("/report", (req, res) => {
  res.render("Date-Wise_Attendence",
    {
      pageTitle: "Date Wise Attendance Report",
      currentPage: "DateWiseReport",
      IsLoggedIn: req.session.IsLoggedIn || false,
      user: req.session.user || {}
    }
  ); // Renders EJS form page
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
    console.log('reached hgere', classInfo.batches);

    // Return the full batches array
    res.status(200).json({ batches: classInfo.batches });

  } catch (error) {
    console.error('Error fetching lab batches and students:', error);
    res.status(500).json({ message: 'Server error' });
  }
})
const XLSX = require("xlsx");

// router.get("/attendance/:branch/:year/:semester/:section", async (req, res) => {
//   try {
//     const { branch, year, semester, section } = req.params;
//     console.log(`📤 Generating full formatted Excel for ${branch}-${year}-${semester}-${section}`);

//     const classDoc = await StudentAttendance.findOne({
//       branchName: branch,
//       year,
//       semester,
//       sectionName: section
//     });

//     if (!classDoc) {
//       return res.status(404).send("No attendance data found for this class.");
//     }

//     const students = classDoc.students || [];
//     const subjectMap = new Map();

//     // Collect subjects dynamically
//     students.forEach((student) => {
//       (student.subjectTotals || []).forEach((sub) => {
//         if (!subjectMap.has(sub.subject)) subjectMap.set(sub.subject, sub.subject);
//       });
//     });

//     const subjects = Array.from(subjectMap.values());

//     // ------------------------------
//     // 1️⃣ HEADER TEXT (4 lines)
//     // ------------------------------
//     const headerText = [
//       [`SHRI G. S. INSTITUTE OF TECHNOLOGY & SCIENCE, INDORE`],
//       [`SESSION : July-Dec 2025, Semester "A"`],
//       [`III YEAR ATTENDANCE SHEET SECTION ${section.toUpperCase()}`],
//       [`From 21/07/2025 to 30/09/2025`],
//       [],
//     ];

//     // ------------------------------
//     // 2️⃣ TABLE HEADER (2 rows)
//     // ------------------------------
//     const topHeader = ["S. No.", "Enrollment No", "Name"];
//     const subHeader = ["", "", ""];

//     subjects.forEach((sub) => {
//       topHeader.push(sub, "", ""); // merged header
//       subHeader.push("TH", "LAB", "%");
//     });

//     topHeader.push("Total Lectures", "Total Attended", "Total %", "Signature");
//     subHeader.push("", "", "", "");

//     const data = [...headerText, topHeader, subHeader];

//     // ------------------------------
//     // 3️⃣ STUDENT DATA ROWS
//     // ------------------------------
//     students.forEach((student, i) => {
//       const row = [i + 1, student.enrollmentNo, student.name];
//       subjects.forEach((sub) => {
//         const found = student.subjectTotals?.find((s) => s.subject === sub);
//         const th = found?.totalClass || 0;
//         const lab = found?.totalPresent || 0;
//         const percent = th > 0 ? ((lab / th) * 100).toFixed(0) : "0";
//         row.push(th, lab, percent);
//       });
//       row.push(
//         student.totalClass,
//         student.totalPresent,
//         student.overallPercentage,
//         "" // Signature column
//       );
//       data.push(row);
//     });

//     // ------------------------------
//     // 4️⃣ CREATE SHEET
//     // ------------------------------
//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.aoa_to_sheet(data);

//     // ------------------------------
//     // 5️⃣ MERGE CELLS (Title + Subjects)
//     // ------------------------------
//     const merges = [];

//     // Merge header text lines (1–4)
//     for (let r = 0; r < 4; r++) {
//       merges.push({ s: { r, c: 0 }, e: { r, c: 10 + subjects.length * 3 } });
//     }

//     // Subject header merges
//     let startCol = 3; // after S.No, Enrollment No, Name
//     subjects.forEach(() => {
//       merges.push({
//         s: { r: 5, c: startCol },
//         e: { r: 5, c: startCol + 2 },
//       });
//       startCol += 3;
//     });

//     // Merge Total/Signature headers
//     merges.push(
//       { s: { r: 5, c: startCol }, e: { r: 6, c: startCol } },       // Total Lectures
//       { s: { r: 5, c: startCol + 1 }, e: { r: 6, c: startCol + 1 } }, // Total Attended
//       { s: { r: 5, c: startCol + 2 }, e: { r: 6, c: startCol + 2 } }, // Total %
//       { s: { r: 5, c: startCol + 3 }, e: { r: 6, c: startCol + 3 } }  // Signature
//     );

//     ws["!merges"] = merges;

//     // ------------------------------
//     // 6️⃣ COLUMN WIDTHS
//     // ------------------------------
//     ws["!cols"] = [
//       { wch: 6 },
//       { wch: 15 },
//       { wch: 25 },
//       ...Array(subjects.length * 3).fill({ wch: 10 }),
//       { wch: 15 },
//       { wch: 15 },
//       { wch: 10 },
//       { wch: 15 },
//     ];

//     // ------------------------------
//     // 7️⃣ STYLING (optional basic)
//     // ------------------------------
//     const range = XLSX.utils.decode_range(ws["!ref"]);
//     for (let R = 0; R <= range.e.r; ++R) {
//       for (let C = 0; C <= range.e.c; ++C) {
//         const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//         if (!ws[cellAddress]) continue;
//         ws[cellAddress].s = {
//           alignment: { horizontal: "center", vertical: "center" },
//           font: R < 4 ? { bold: true, sz: 14 } : R === 5 ? { bold: true } : {},
//         };
//       }
//     }

//     XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

//     // ------------------------------
//     // 8️⃣ SEND FILE
//     // ------------------------------
//     const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${branch}_${year}_${semester}_Sec-${section}_Attendance.xlsx`
//     );
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.send(buffer);
//   } catch (err) {
//     console.error("❌ Error generating Excel:", err);
//     res.status(500).send("Error generating Excel report");
//   }
// });

router.get("/attendance/:branch/:year/:semester/:section", async (req, res) => {
  try {
    const { branch, year, semester, section } = req.params;

    // 🔹 Find the class document
    const classDoc = await StudentAttendance.findOne({
      branchName: branch,
      year,
      semester,
      sectionName: section
    });

    if (!classDoc) {
      return res.render("showReport", {
        pageTitle: "Attendance Report",
        currentPage: "AttendanceReport",
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

          console.log('student', student);
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
    console
    console.log("✅ Attendance data prepared successfully");
    res.render("showReport", {
      pageTitle: "Attendance Report",
      currentPage: "AttendanceReport",
      IsLoggedIn: req.session.IsLoggedIn || false,
      user: req.session.user || {},
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