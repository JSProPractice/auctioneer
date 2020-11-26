const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  token: { type: String, required: true },
  validTill: Date,
  type: { type: String, required: true, enum: ['forgot_password', 'confirm_email'] }
})

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;