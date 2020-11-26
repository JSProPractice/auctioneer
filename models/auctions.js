const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const auctionsSchema = new Schema({
  itemName: { type: String, required: true },
  photoLink: String,
  minBidAmmount: { type: String, required: true },
  timeLimitInSec: { type: Number, default: 180 },
  description: { type: String, required: true },
  startTime: Date,
  maxWaitingTimeForBid: Number,
  createdAt: {type: Date, default: Date.now},
  modifiedAt: Date,
  ownerId: {type: Schema.Types.ObjectId, ref: 'User'},
  status: { type: String, enum: ['Pending', 'Live', 'Completed'] },
  winner: String,
  winningBidAmmount: Number,
  endTime: Date,
  bidHistory: [
    {
      participant: {type: Schema.Types.ObjectId, ref: 'User', required: true},
      bidAmount: {type: Number, required: true},
      timestamp: {type: Date, default: Date.now}
    }
  ]
});

const Auction = mongoose.model('Auction', auctionsSchema);
module.exports = Auction;