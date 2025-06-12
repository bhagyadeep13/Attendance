const student = require("../models/student");

exports.markAttendance = async (req,res,next) =>
{
  res.render('store/markAttendence',{
    students: [],
    selectedClass: '',
    selectedSection: ''
  })
}

exports.markAttendanceDetails = async (req,res,next)=>
  {
      const {className,sectionName,subject,date} = req.body;
      const classDoc = await student.findOne({className,sectionName})
      if(classDoc)
      {
          res.render('store/markAttendence',{
            selectedClass: className,
            selectedSubject: subject,
            selectedDate: Date,
            selectedSection: sectionName,
            students: classDoc.students,
          })
      }
  }
