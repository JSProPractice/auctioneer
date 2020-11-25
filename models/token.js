const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: String,
  token: String,
  validTill: Date,
  type: String
})

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;