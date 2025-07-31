const student = require("../models/student");

exports.getmarkAttendance = async (req,res,next) =>
{
  res.render('store/markAttendence',
    {
      students: [],
      selectedClass: '',
      selectedSection: '',
      pageTitle: "Mark Attendance",
      currentPage: "Mark Attendance",
      IsLoggedIn: false,
      pageTitle: "Mark Attendance",
      currentPage: "Mark_Attendance",
      isLoggedIn: req.session.isLoggedIn || false,
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
            pageTitle: "Mark Attendance",
            currentPage: "Mark_Attendance",
            IsLoggedIn: req.session.isLoggedIn || false,
          })
      }
  }

