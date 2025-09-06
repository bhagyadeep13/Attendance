const mongoose = require("mongoose");

const StudentAttendanceSchema = new mongoose.Schema({
  enrollmentNo: { type: String, required: true },
  sectionName: { type: String, required: true }, // A, B, C
  year: { type: String, required: true },        // I, II, III, IV

  // 🔹 Daily attendance with subjects
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

  // 🔹 Overall totals (all subjects combined)
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
});

const StudentAttendance = mongoose.model("StudentAttendance", StudentAttendanceSchema);
module.exports = StudentAttendance;
