const aboutController = require('../controllers/aboutController');
const aboutRouter = require('express').Router();

aboutRouter.get('/about', aboutController.getAbout);

module.exports = aboutRouter;
