// controllers/subjectController.js
const Subject = require('../models/subjectModel');

// Add or update subjects
exports.addOrUpdateSubjects = async (req, res) => {
  const { branchName, year, semester, sectionName, subjects } = req.body;

  if (!branchName || !year || !semester || !sectionName || !subjects || !subjects.length) {
    return res.status(400).json({ error: "All fields are required and at least one subject" });
  }

  try {
    let classDoc = await Subject.findOne({ branchName, year, semester, sectionName });

    if (classDoc) {
      // Update existing subjects
      classDoc.subjects = subjects;
    } else {
      // Create new document
      classDoc = new Subject({ branchName, year, semester, sectionName, subjects });
    }

    await classDoc.save();
    res.json({ message: "Subjects saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch subjects for a class
exports.getSubjects = async (req, res) => {
  const { branchName, year, semester, sectionName } = req.body;
  
  if (!branchName || !year || !semester || !sectionName) {
    return res.status(400).json({ error: "All query parameters required" });
  }

  try {
    const classDoc = await Subject.findOne({ branchName, year, semester, sectionName });
    res.json(classDoc ? classDoc.subjects : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.deleteSubject = async (req, res) => {
  const { id } = req.params; // _id of the subject inside subjects array
   
  try {
    // Find the document containing this subject and remove it from the array
    const doc = await Subject.findOneAndUpdate(
      { "subjects._id": id },
      { $pull: { subjects: { _id: id } } },
      { new: true }
    );

    if (!doc) return res.status(404).json({ error: "Subject not found" });

    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};