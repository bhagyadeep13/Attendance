
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

exports.getStudentDashboard = (req, res) => 
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
