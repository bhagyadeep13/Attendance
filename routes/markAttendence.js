const express = require('express')
const markAttendanceRouter = express.Router();
const markAttendanceController = require('../controllers/markAttendenceController')

markAttendanceRouter.get('/markAttendance',markAttendanceController.getmarkAttendance)
markAttendanceRouter.post('/markAttendance',markAttendanceController.markAttendanceDetails)

module.exports = markAttendanceRouter;