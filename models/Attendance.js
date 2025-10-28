    const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
   year: { type: String, required: true },       // Example: 2025, 3rd Year, etc.
   sectionName: { type: String, required: true }, // A, B, C
   subject: { type: String, required: true },     // e.g., Maths, DSA
   date: { type: Date, required: true },          // Date of lecture
   totalPresent: { type: Number, default: 0 },    // How many attended
   totalStudents:{type :Number,required:true}, 
   presentStudents: [
     {
       enrollmentNo: { type: String, required: true },
     }
   ]
});

// Named export pattern for CommonJS:
module.exports = mongoose.model("Attendance", attendanceSchema);