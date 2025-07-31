const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
  },
  userType: {
    type: String,
    enum: ['teacher', 'student'],
    default: 'student'
  },
  enrollmentNo: {
    type: String,
    required: function () {
      return this.userType === 'student';
    },
  },
});

module.exports = mongoose.model('User', userSchema);