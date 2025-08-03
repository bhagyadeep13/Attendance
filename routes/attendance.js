const express = require('express');
const AttendenceRouter = express.Router();
const attendanceController = require('../controllers/AttendenceNew');

AttendenceRouter.get('/attendance', attendanceController.getAttendence);

AttendenceRouter.post('/attendance', attendanceController.postAttendence);

AttendenceRouter.post('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  attendanceRecords = attendanceRecords.filter(record => record.id !== id);
  res.render("attendance", { records: attendanceRecords });
});

module.exports = AttendenceRouter;
