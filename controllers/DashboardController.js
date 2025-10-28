const student = require('../models/student');
const StudentAttendance = require('../models/StudentAttendanceSchema');

const courses = [
  {
    manualCourse: "Maths",
    className: "2nd Sem",
    branchName: "CSE",
    teacher1: "Mr. A",
    teacher2: "Ms. B"
  }
];

const pieData = [
  { name: "Maths", value: 20, total: 24 },
  { name: "Physics", value: 18, total: 24 },
  { name: "Maths", value: 20, total: 24 },
  { name: "Physics", value: 18, total: 24 },
  { name: "MS", value: 20, total: 24 },
  { name: "OS", value: 18, total: 24 }
];

exports.getDashboard = (req, res) => {
  res.render('student-dashboard', {
    courses,
    pieData,
    toastMessage: req.session.toastMessage || '',
    pageTitle: "Student Dashboard",
    currentPage: "StudentDashboard",
    IsLoggedIn: req.session.IsLoggedIn || false,
    user: req.session.user || {},
  });
};

// const StudentAttendance = require("../models/StudentAttendance");

exports.getStudentDashboard = async (req, res) => {
  try {
    const student = req.session.user;
    if (!student) {
      return res.status(401).send("Unauthorized");
    }

    const enrollmentNo = student.enrollmentNo;
    console.log("📥 Fetching dashboard for:", enrollmentNo, student);

    // 🔹 Find the class document containing this student
    const classDoc = await StudentAttendance.findOne({
      "students.enrollmentNo": enrollmentNo,
    });

    if (!classDoc) {
      return res.status(404).send("Attendance record not found");
    }

    // 🔹 Extract that particular student's record
    const studentRecord = classDoc.students.find(
      (s) => s.enrollmentNo === enrollmentNo
    );

    if (!studentRecord) {
      return res.status(404).send("Student data not found");
    }

    // ✅ Extract year, section, branch, semester from classDoc
    const classInfo = {
      branchName: classDoc.branchName,
      year: classDoc.year,
      semester: classDoc.semester,
      sectionName: classDoc.sectionName,
    };

    console.log("✅ Student Attendance Data:", studentRecord);
    console.log("📚 Class Info:", classInfo);

    // 🔹 Pass everything to dashboard view
    res.render("store/dashboard", {
      student: studentRecord,
      classInfo, // ✅ pass class details
      name: student.name,
      email: student.email,
      toastMessage: req.session.toastMessage || "",
      pageTitle: "Dashboard",
      currentPage: "Dashboard",
      IsLoggedIn: req.session.IsLoggedIn || false,
      user: req.session.user || {},
    });
  } catch (err) {
    console.error("❌ Error fetching student dashboard:", err);
    res.status(500).send("Internal Server Error");
  }
};

// const StudentAttendance = require("../models/StudentAttendance"); // adjust path if needed

// 📌 Get Attendance Report for a specific Subject & Date
exports.getSubjectAttendanceReport = async (req, res) => {
  try {
    const { branchName, year, semester, sectionName, subject, date } = req.query;

    if (!branchName || !year || !semester || !sectionName || !subject || !date) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Convert date string to proper Date object (remove time part)
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    // 🔹 Fetch class document
    const classDoc = await StudentAttendance.findOne({
      branchName,
      year,
      semester,
      sectionName,
    });

    if (!classDoc) {
      return res.status(404).json({ error: "Class not found!" });
    }

    // 🔹 Prepare attendance report
    const report = classDoc.students.map((student) => {
      // Find attendance record for given date
      const attendanceForDate = student.attendance.find((a) => {
        const aDate = new Date(a.date);
        aDate.setHours(0, 0, 0, 0);
        return aDate.getTime() === selectedDate.getTime();
      });

      // If attendance exists for date, find the subject status
      let status = "Not Marked";
      if (attendanceForDate) {
        const subjectRecord = attendanceForDate.subjects.find(
          (s) => s.subject === subject
        );
        if (subjectRecord) status = subjectRecord.status;
      }

      return {
        enrollmentNo: student.enrollmentNo,
        status,
      };
    });

    res.render("Date_Wise_Attendence_result", {
      pageTitle: "Date Wise Attendance Report",
      currentPage: "DateWiseReport",
      IsLoggedIn: req.session.IsLoggedIn || false,
      user: req.session.user || {},
      branchName,
      year,
      semester,
      sectionName,
      subject,
      date: selectedDate.toDateString(),
      totalStudents: report.length,
      presentCount: report.filter(r => r.status === "Present").length,
      absentCount: report.filter(r => r.status === "Absent").length,
      report
    });


  } catch (error) {
    console.error("❌ Error generating subject attendance report:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// const StudentAttendance = require("../models/StudentAttendance");

// controllers/DashboardController.js
// const StudentAttendance = require("../models/StudentAttendance");

exports.getSemestersAndSections = async (req, res) => {
  try {
    const { branchName, year } = req.query;
    console.log('in data', branchName, year);
    // year="ii";
    // year="II";
    if (!branchName || !year) return res.json([]);
    console.log('result');
    const className = branchName;
    const result = await student.aggregate([
      { $match: { className, year } },
      {
        $group: {
          _id: { semester: "$semester", sectionName: "$sectionName" }
        }
      },
      {
        $group: {
          _id: "$_id.semester",
          sections: { $addToSet: "$_id.sectionName" }
        }
      },
      {
        $project: {
          _id: 0,
          semester: "$_id",
          sections: 1
        }
      },
      // { $sort: { semester: 1 } }
    ]);
    console.log('result', result);

    res.json(result);
  } catch (error) {
    console.error("❌ Error fetching semesters/sections:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

exports.editAttendance = async (req, res) => {
  try {
    const {
      branchName,
      year,
      semester,
      sectionName,
      date,
      subject,
      enrollmentNo,
      status
    } = req.body;

    if (!branchName || !year || !semester || !sectionName || !date || !subject || !enrollmentNo || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 🔎 Find class record first
    const classRecord = await StudentAttendance.findOne({
      branchName,
      year,
      semester,
      sectionName
    });

    if (!classRecord) {
      return res.status(404).json({ error: "Class record not found" });
    }

    // 🔎 Find student inside class
    const student = classRecord.students.find(s => s.enrollmentNo === enrollmentNo);
    if (!student) return res.status(404).json({ error: "Student not found" });

    // Normalize date to start of day for comparison
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Find attendance entry for that date
    const attEntry = student.attendance.find(a => {
      const attDate = new Date(a.date);
      attDate.setHours(0, 0, 0, 0);
      return attDate.getTime() === targetDate.getTime();
    });

    if (!attEntry) return res.status(404).json({ error: "Attendance entry for this date not found" });

    // Find subject inside that date entry
    const subEntry = attEntry.subjects.find(s => s.subject === subject);
    if (!subEntry) return res.status(404).json({ error: "Subject not found for this date" });

    // ✅ Update status
    subEntry.status = status;

    // Save the entire document
    await classRecord.save();

    res.json({ message: "Attendance updated successfully", updatedRecord: classRecord });
  } catch (error) {
    console.error("❌ Error updating attendance:", error);
    res.status(500).json({ error: "Failed to update attendance" });
  }
};


