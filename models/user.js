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
    unique: true,
    sparse: true,
    required: function () {
      return this.userType === 'student';
    },
  },
});
// Ensure enrollmentNo is removed from non-students before saving
userSchema.pre('save', function (next) {
  if (this.userType !== 'student') {
    this.enrollmentNo = undefined;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);