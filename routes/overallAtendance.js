router.get("/overallAttendance", async (req, res) => {
  try {
    const { className, year, section } = req.query;

    const students = await StudentAttendance.find({ sectionName: section, year });

    res.render("/overallAttendance", { 
      classInfo: { className, year, section },
      students 
    });
  } catch (err) {
    res.render("/overallAttendance", { error: "Server Error", students: [] });
  }
});