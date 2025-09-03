const express = require('express');
const AttendenceRouter = express.Router();
const attendanceController = require('../controllers/AttendenceNew');

AttendenceRouter.get('/attendance', attendanceController.getAttendence);
AttendenceRouter.post('/attendance', attendanceController.postAttendence);

AttendenceRouter.post('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let attendanceRecords = [];
  attendanceRecords = attendanceRecords.filter(record => record.id !== id);
  res.render("attendance", { 
    records: attendanceRecords,
    pageTitle: "Attendance",
    currentPage: "Attendance",
    IsLoggedIn: req.session.IsLoggedIn,
    user: req.session.user || {},
    toastMessage: req.session.toastMessage || null,
  });
});

module.exports = AttendenceRouter;
