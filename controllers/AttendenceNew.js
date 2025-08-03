
let attendanceRecords = [ {
      id: 1,
      date: '2025-08-01',
      totalClasses: 6,
      attendedClasses: 5,
      percentage: ((5 / 6) * 100).toFixed(2),
      status: 'Present',
    },
    {
      id: 2,
      date: '2025-07-31',
      totalClasses: 5,
      attendedClasses: 2,
      percentage: ((2 / 5) * 100).toFixed(2),
      status: 'Absent',
    },
    {
      id: 3,
      date: '2025-07-30',
      totalClasses: 4,
      attendedClasses: 4,
      percentage: 100.0,
      status: 'Present',
    }];

exports.getAttendence = (req, res, next) => {

    console.log("Session User:", req.session);
     res.render('attendance', { 
      records: attendanceRecords,
      pageTitle: "Attendance Records",
      currentPage: "Attendance",
      IsLoggedIn: req.session.IsLoggedIn || false,
      user: req.session.user || {},
      toastMessage: req.session.toastMessage || null,
     });
}

exports.postAttendence = (req, res, next) => {
    const { date, totalClasses, attendedClasses, status } = req.body;
    console.log("Received Attendance Data:", { date, totalClasses, attendedClasses, status });
    const percentage = ((attendedClasses / totalClasses) * 100).toFixed(2);
    attendanceRecords.push({
        id: attendanceRecords.length + 1,
        date: new Date(date).toDateString(),
        totalClasses: parseInt(totalClasses),
        attendedClasses: parseInt(attendedClasses),
        status,
        percentage,
    });
    res.render("attendance", { 
      records: attendanceRecords,
      toastMessage: { type: 'success', text: 'Attendance record added successfully!' },
      pageTitle: "Attendance Records",
      currentPage: "Attendance",  
      IsLoggedIn: req.session.IsLoggedIn || false,
      user: req.session.user || {},
    });
}