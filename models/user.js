const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true,'First name is required'],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true,'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true,'Password is required'],
    minlength: 8,
  },
  userType: {
    type: String,
    enum: ['host', 'student'],
    default: 'host'
  },
});

module.exports = mongoose.model('User', userSchema);