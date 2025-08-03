const express = require('express');
const router = express.Router();

let attendanceRecords = [ {
      id: 1,
      date: '2025-08-01',
      totalClasses: 6,
      attendedClasses: 5,
      percentage: ((5 / 6) * 100).toFixed(2),
      status: 'Present',
    },
    {
      id: 2,
      date: '2025-07-31',
      totalClasses: 5,
      attendedClasses: 2,
      percentage: ((2 / 5) * 100).toFixed(2),
      status: 'Absent',
    },
    {
      id: 3,
      date: '2025-07-30',
      totalClasses: 4,
      attendedClasses: 4,
      percentage: 100.0,
      status: 'Present',
    }];

router.get('/attendance', (req, res) => {
  res.render('attendance', { records: attendanceRecords });
});

router.post('/attendance', (req, res) => {
  const { date, totalClasses, attendedClasses, status } = req.body;
  const percentage = ((attendedClasses / totalClasses) * 100).toFixed(2);
  attendanceRecords.push({
    id: attendanceRecords.length + 1,
    date: new Date(date).toDateString(),
    totalClasses: parseInt(totalClasses),
    attendedClasses: parseInt(attendedClasses),
    status,
    percentage,
  });
  res.redirect('/attendance');
});

router.post('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  attendanceRecords = attendanceRecords.filter(record => record.id !== id);
  res.redirect('/attendance');
});

module.exports = router;
