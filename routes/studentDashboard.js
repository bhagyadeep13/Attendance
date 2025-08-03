const express = require('express');
const studentDashboardRouter = express.Router();
const studentDashboardController = require('../controllers/DashboardController');

studentDashboardRouter.get('/student-dashboard', studentDashboardController.getStudentDashboard);
studentDashboardRouter.get('/student-dashboard', studentDashboardController.getStudentDashboard);

module.exports = studentDashboardRouter;
