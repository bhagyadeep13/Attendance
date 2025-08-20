const Student = require('../models/student');

exports.getAddStudent = (req, res, next) => {
  console.log(req.session.IsLoggedIn)
  res.render("store/data", {
    pageTitle: "Upload Page",
    currentPage: "Upload",
    IsLoggedIn: req.session.IsLoggedIn,
    error: [],
    oldInput: {},
    user: req.session.user || {},
    toastMessage: req.session.toastMessage || null,
  }
)
}; 

exports.postAddStudent = async (req, res) => {

  try {
    const { className, sectionName, students ,year} = req.body;

    console.log('Received data:', { className, sectionName,year, students });

    // Validate required fields
    if (!className || !sectionName || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: 'Invalid or incomplete data format' });
    }

    let classDoc = await Student.findOne({ className, sectionName , year });

    if (classDoc) {
      const existingEnrollments = new Set(classDoc.students.map(s => String(s.enrollmentNo)));
      // Filter out students whose enrollmentNo already exists in the class
      const uniqueStudents = students.filter(
        s => !existingEnrollments.has(String(s.enrollmentNo))
      );
      console.log('Unique students to be added:', uniqueStudents);

      if (uniqueStudents.length === 0) {
        return res.status(409).json({ message: 'All students already exist or are invalid.' });
      }
      console.log('New class document created 1:', classDoc);
      classDoc.students.push(...uniqueStudents);
      await classDoc.save();
    } else {
      const validStudents = students.filter(s => s.name && String(s.enrollmentNo));
      console.log('Valid students to be added:', validStudents);
      classDoc = new Student({
        className,
        sectionName,
        year,
        students: validStudents
      });
      console.log('New class document created:', classDoc);
      await classDoc.save();
    }
    res.status(200).json({ message: 'Students saved successfully!' });
  } catch (error) {
    console.error('Error saving students:', error);   
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getStudentsByClassAndSection = async (req, res) => {
  const { className, sectionName, year } = req.query;
  console.log('Query parameters:', { className, sectionName, year });
  console.log(req.session.IsLoggedIn);
  const toastMessage = req.session.toastMessage;
  req.session.toastMessage = null; // Clear the toast message after rendering
  if (!className || !sectionName || !year) {
    return res.render('store/showStudents', {
      selectedClass: '',
      selectedSection: '',
      selectedYear: '',
      students: [],
      pageTitle: "Show Students",
      currentPage: "Show_Students",
      IsLoggedIn: req.session.IsLoggedIn,
      user: req.session.user || {},
      toastMessage: toastMessage || null,
    });
  }
  console.log('Query parameters:', { className, sectionName, year });
    const classDoc = await Student.findOne({ className, sectionName, year });

    if (!classDoc || classDoc.students.length === 0) {
      return res.render('store/showStudents', {
        selectedClass: className,
        selectedSection: sectionName,
        selectedYear: year || '',
        students: [],
        pageTitle: "Show Students",
        currentPage: "Show_Students",
        IsLoggedIn: req.session.IsLoggedIn,
        user: req.session.user || {},
        toastMessage: toastMessage || null,
      });
    }
    else {
    res.render('store/showStudents', {
      selectedClass: className,
      selectedSection: sectionName,
      selectedYear: year || '',
      students: classDoc ? classDoc.students : [],
      pageTitle: "Show Students",
      currentPage: "Show_Students",
      IsLoggedIn: req.session.IsLoggedIn,
      user: req.session.user || {},
      toastMessage: toastMessage || null,
    });
  } 
}

/*exports.addNewStudent = async (req,res,next) =>
{
    const className = req.body.className;
    const sectionName = req.body.sectionName;
    const selectedYear = req.body.year;

    const {studentName,enrollmentNo} = req.body;

    if (!className || !sectionName || !studentName || !enrollmentNo) {
      return res.status(400).json({ message: 'Incomplete data format' });
    }

    let classDoc = await Student.findOne({ className,sectionName});
    if (classDoc) {

      const existUser = await Student.exists({ enrollmentNo: enrollmentNo })
      if(existUser)
      {
        return res.status(409).json({ message: 'Student with this enrollment number already exists.' });
      }
      else
      {
        classDoc.students.push({ name: studentName, enrollmentNo });
        await classDoc.save();
      }
    }
    else
    {
          classDoc = new Student({
          className: className,
          sectionName: sectionName,
          students: [{ name: studentName, enrollmentNo: enrollmentNo }]
        });
      classDoc.students.push({ name: studentName, enrollmentNo });
      await classDoc.save();
    }
    console.log("New Student Added")

    const student = await Student.findOne({
      className: className,
      sectionName: sectionName,
      year: year
    });
    req.session.toastMessage = { type: 'success', text: 'New Student added successfully!' };
    res.render('store/showStudents', {
      selectedClass: className,
      selectedSection: sectionName,
      students: student.students,
      pageTitle: "Show Students",
      currentPage: "Show_Students",
      IsLoggedIn: req.session.IsLoggedIn,
      user: req.session.user || {},
      toastMessage: req.session.toastMessage || null
    });
}*/

/*exports.deleteStudent = async (req, res, next) => {

    const { className, sectionName,studentIds,year } = req.body;
    console.log(req.body);
    const student = await Student.findOne({className,sectionName,year})

    if(!Array.isArray(studentIds))
    student.students.pull({_id: studentIds})
    else
    student.students.pull(...studentIds.map(id => ({ _id: id })));

    await student.save();
    req.session.toastMessage = { type: 'success', text: 'Student(s) deleted successfully!' };
    console.log("Student(s) deleted:", req.session.toastMessage);
     /*student.students.pull({ _id: Student_id }); // Use pull to remove by id
    console.log("students deleted")
    res.render('store/showStudents', {
      selectedClass: className,
      selectedSection: sectionName,
      students: student.students,
      pageTitle: "Show Students",
      currentPage: "Show_Students", 
      IsLoggedIn: req.session.IsLoggedIn,
      user: req.session.user || {},
      toastMessage: req.session.toastMessage || null,
    });
}
*/
exports.addNewStudent = async (req, res, next) => {
  try {
    const { className, sectionName, year, studentName, enrollmentNo } = req.body;

    // Validate input
    if (!className || !sectionName || !year || !studentName || !enrollmentNo) {
      return res.status(400).json({ message: 'Incomplete data format' });
    }

    // Find class-section-year
    let classDoc = await Student.findOne({ className, sectionName, year });

    if (classDoc) {
      // Check if enrollment already exists in this class-section-year
      const exists = classDoc.students.some(s => s.enrollmentNo === enrollmentNo);
      if (exists) {
        return res.status(409).json({ message: 'Student with this enrollment number already exists in this class.' });
      }

      // Add new student
      classDoc.students.push({ name: studentName, enrollmentNo });
      await classDoc.save();
    } else {
      // Create new class-section-year document
      classDoc = new Student({
        className,
        sectionName,
        year,
        students: [{ name: studentName, enrollmentNo }]
      });
      await classDoc.save();
    }

    console.log("✅ New Student Added");

    // Reload updated class doc
    const student = await Student.findOne({ className, sectionName, year });

    // Flash success message
    req.session.toastMessage = { type: 'success', text: 'New Student added successfully!' };

    return res.render('store/showStudents', {
      selectedClass: className,
      selectedSection: sectionName,
      selectedYear: year,
      students: student.students,
      pageTitle: "Show Students",
      currentPage: "Show_Students",
      IsLoggedIn: req.session.IsLoggedIn,
      user: req.session.user || {},
      toastMessage: req.session.toastMessage || null
    });

  } catch (error) {
    console.error("❌ Error adding student:", error);
    return res.status(500).json({ message: 'Server Error' });
  }
};



exports.deleteStudent = async (req, res, next) => {
 const { className, sectionName, year, studentIds, deleteAll } = req.body;

  const classDoc = await Student.findOne({ className, sectionName, year });
  if (!classDoc) {
    return res.redirect(`/showStudents?className=${className}&sectionName=${sectionName}&year=${year}`);
  }

  if (deleteAll) {
    // Remove all students
    classDoc.students = [];
  } else if (studentIds) {
    // Handle single or multiple selected checkboxes
    const idsToDelete = Array.isArray(studentIds) ? studentIds : [studentIds];
    classDoc.students = classDoc.students.filter(s => !idsToDelete.includes(s._id.toString()));
  }

  await classDoc.save();

  res.redirect(`/showStudents?className=${className}&sectionName=${sectionName}&year=${year}`);
}


exports.deleteStudentOne = async (req, res, next) => {
 const { studentIds, className, sectionName, year } = req.body;
 console.log('check',studentIds,className,sectionName,year);
 if (!studentIds) return res.redirect("back");

  try {
    // Ensure studentIds is always an array
    const idsArray = Array.isArray(studentIds) ? studentIds : [studentIds];

    // Pull matching students from the array
    await Student.updateOne(
      { className, sectionName, year },
      { $pull: { students: { _id: { $in: idsArray } } } }
    );

    req.session.toastMessage = { type: "success", text: "Selected students deleted!" };

    res.redirect(`/showStudents?className=${className}&sectionName=${sectionName}&year=${year}`);
  } catch (error) {
    console.error(error);
    req.session.toastMessage = { type: "error", text: "Error deleting students!" };
    res.redirect("back");
  }
}