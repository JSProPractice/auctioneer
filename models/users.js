const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: {type: String, unique: true},
  password: String,
  dob: Date,
  createdAt: {type: Date, default: Date.now()},
  isVerified: {type: Boolean, default: false}
});

const User = mongoose.model('User', userSchema);
module.exports = User;