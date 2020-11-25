const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  emailId: {type: String, unique: true},
  password: String,
  dob: String,
  createdAt: {type: Date, default: Date.now()},
  isVerified: {type: Boolean, default: false}
});

const User = mongoose.model('User', userSchema);
module.exports = User;