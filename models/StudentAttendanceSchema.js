const mongoose = require("mongoose");

const StudentAttendanceSchema = new mongoose.Schema({
  // 🔹 Class Identifiers (unique combination)
  branchName: { type: String, required: true },  // e.g., CSE, ECE, ME
  year: { type: String, required: true },        // I, II, III, IV
  semester: { type: String, required: true },    // 1, 2, 3, 4, 5, 6, 7, 8
  sectionName: { type: String, required: true }, // A, B, C

  // 🔹 Students of this class
  students: [
    {
      enrollmentNo: { type: String, required: true },

      // 🔹 Individual Attendance per student
      attendance: [
        {
          date: { type: Date, required: true },
          subjects: [
            {
              subject: { type: String, required: true },
              status: { type: String, enum: ["Present", "Absent"], required: true }
            }
          ]
        }
      ],

      // 🔹 Overall totals for this student
      totalClass: { type: Number, default: 0 },
      totalPresent: { type: Number, default: 0 },
      totalAbsent: { type: Number, default: 0 },

      // 🔹 Subject-wise totals
      subjectTotals: [
        {
          subject: { type: String, required: true },
          totalClass: { type: Number, default: 0 },
          totalPresent: { type: Number, default: 0 },
          totalAbsent: { type: Number, default: 0 }
        }
      ]
    }
  ]
});

// ✅ Create a compound index so each branch-year-semester-section is unique
StudentAttendanceSchema.index(
  { branchName: 1, year: 1, semester: 1, sectionName: 1 },
  { unique: true }
);

const StudentAttendance = mongoose.model("StudentAttendance", StudentAttendanceSchema);
module.exports = StudentAttendance;
