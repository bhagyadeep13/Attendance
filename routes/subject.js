// routes/subjectRoutes.js
const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjects');

router.post('/add-subjects', subjectController.addOrUpdateSubjects);
router.post('/get-subjects', subjectController.getSubjects);
router.delete("/delete/:id", subjectController.deleteSubject);
module.exports = router;
