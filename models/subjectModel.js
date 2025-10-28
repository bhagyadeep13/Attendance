const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  branchName: { type: String, required: true },  // e.g., CSE, ECE
  year: { type: String, required: true },        // I, II, III, IV
  semester: { type: String, required: true },    // 1, 2, 3, 4, 5, 6, 7, 8
  sectionName: { type: String, required: true }, // A, B, C

  // ✅ List of subjects for this class
  subjects: [
    {
      subjectCode: { type: String, required: true }, // e.g., CS101
      subjectName: { type: String, required: true }  // e.g., Data Structures
    }
  ]
});

// ✅ Ensure one unique document per (branch, year, semester, section)
SubjectSchema.index(
  { branchName: 1, year: 1, semester: 1, sectionName: 1 },
  { unique: true }
);

const Subject = mongoose.model("Subject", SubjectSchema);
module.exports = Subject;
