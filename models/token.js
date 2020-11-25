const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: String,
  token: String,
  validTil: Date,
  type: String
})

const token = mongoose.model('token', tokenSchema);
module.exports = token;