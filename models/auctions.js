const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auctionsSchema = new Schema({
  itemName: String,
  photoLink: String,
  minBidAmmount: String,
  timeLimit: Number,
  description: String,
  startTime: {type: Date},
  maxWaitingLimitForABid: Number,
  createdAt: {type: Date, default: Date.now},
  modifiedAt: Date,
  ownerId: String,
  status: String,
  winner: String,
  winningBidAmmount: Number,
  endTime: Date,
  bidHistory: {
    participant: String,
    bidAmount: Number,
    timestamp: {type: Date, default: Date.now()}
  }
});

const auctions = mongoose.model('auctions', auctionsSchema);
module.exports = auctions;