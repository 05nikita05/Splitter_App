const mongoose = require('mongoose')
const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  title: {
    type: String,
    // required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  userId: { 
    type: String, required: true
   },
  participants: {
    type: [String],
    required: true
  },
  // Add paidAmounts
  paidAmounts: {
    type: [
      {
        userId: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    default: [], // Initialize as an empty array
  },
});

module.exports = mongoose.model('Expense', expenseSchema);
