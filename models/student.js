const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  enrollmentNo: { type: String, required: true }
});

const batchSchema = new mongoose.Schema({
  batchName: { type: String, required: true }, // e.g., "A1", "A2", "B1"
  students: [studentSchema] // students inside this batch
});

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: [true, 'Class name is required']
  },

  sectionName: {
    type: String,
    required: [true, 'Section name is required']
  },

  year: {
    type: String,
    required: [true, 'Year is required']
  },

  semester: {
    type: String,
    required: [true, 'Semester is required']
  },

  // direct students (without batch division)
  students: [studentSchema],

  // optional batch-wise bifurcation
  batches: [batchSchema]
});

module.exports = mongoose.model('Student', classSchema);