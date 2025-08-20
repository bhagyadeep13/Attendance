const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  className: 
  {
    type: String,
    required: [true, 'Class name is required']
  },

  sectionName: 
  {
    type: String,
    required: [true, 'Section name is required']
  },
  Year: 
  {
    type: String,
    required: [true, 'Year is required']
  },
  students:
  [{
    name: { type: String, required: true },
    enrollmentNo: { type: String, required: true,}  // Allows null/undefined but treats them as non-duplicates}
}]
});

module.exports = mongoose.model('Student', classSchema);
