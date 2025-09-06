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

exports.getDashboard = (req, res) => 
{
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

exports.getStudentDashboard = async (req, res) => {
  const student = req.session.user;
  if (!student) {
    return res.status(401).send('Unauthorized');
  }
  const studentFound = await StudentAttendance.findOne({ enrollmentNo: student.enrollmentNo });
  if (!studentFound) {
    return res.status(404).send('Attendance record not found');
  }
  console.log("Student Found:", studentFound);
  res.render('store/dashboard', { 
    student: studentFound,
    name : student.name,
    email: student.email,
    toastMessage: req.session.toastMessage || '',
    pageTitle: "Dashboard",
    currentPage: "Dashboard",
    IsLoggedIn: req.session.IsLoggedIn || false,
    user: req.session.user || {},
  });
};
