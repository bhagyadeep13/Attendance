const aboutController = require('../controllers/about_IndexController');
const aboutRouter = require('express').Router();

aboutRouter.get('/about', aboutController.getAbout);
aboutRouter.get('/index', aboutController.getIndex);

module.exports = aboutRouter;
