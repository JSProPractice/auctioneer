const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user = require('./users');

const tokenSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'user', required: true},
  token: { type: String, required: true },
  validTill: Date,
  type: { type: String, required: true, enum: ['forgot_password', 'confirm_email'] }
})

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;