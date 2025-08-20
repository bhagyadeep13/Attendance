const AddController = require('../controllers/Add_student');
const AddRouter = require('express').Router();

AddRouter.get('/upload', AddController.getAddStudent);
AddRouter.post('/upload', AddController.postAddStudent);
AddRouter.get('/showStudents', AddController.getStudentsByClassAndSection);
AddRouter.post('/showStudents', AddController.deleteStudent);
AddRouter.post('/addStudent',AddController.addNewStudent), 
AddRouter.post('/deleteStudents', AddController.deleteStudent);
AddRouter.post('/deleteOneStudent', AddController.deleteStudentOne);
AddRouter.post('/addStudent',AddController.addNewStudent),

module.exports = AddRouter;
      