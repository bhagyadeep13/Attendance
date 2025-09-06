const student = require("../models/student");

exports.getmarkAttendance = async (req,res,next) =>
{
  console.log("Session User:", req.session.IsLoggedIn);
  const userType = req.session.user.userType;
  console.log("User Type:", userType);
  res.render('store/markAttendence',
    {
      students: [],
      selectedClass: '',
      selectedSection: '',
      selectedYear: '',
      selectedSubject: '',
      selectedDate: '',
      pageTitle: "Mark Attendance",
      currentPage: "Mark Attendance",
      IsLoggedIn: req.session.IsLoggedIn,
      pageTitle: "Mark Attendance",
      currentPage: "Mark_Attendance",
      user: req.session.user || {},
      toastMessage: req.session.toastMessage || '',
    })
}

exports.markAttendanceDetails = async (req,res,next)=>
  {
      const {className,sectionName,year} = req.body;
      const classDoc = await student.findOne({className,sectionName,year})
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
            IsLoggedIn: req.session.IsLoggedIn || false,
            user: req.session.user || {},
          })
      }
  }

