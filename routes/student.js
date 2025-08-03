const express = require('express');
const router = express.Router();

router.get('/student-dashboard', (req, res) => {
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

  res.render('student-dashboard', { courses, pieData });
});

module.exports = router;
