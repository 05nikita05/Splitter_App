const express = require('express');
const Expense = require('../models/Expense');
const authenticateUser = require('../middleware/auth')
const mongoose = require('mongoose');
const router = express.Router();

router.use(express.json());


// GET route for fetching expenses for a specific user
router.get('/expenses', authenticateUser, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId });

    if (!expenses.length) {
      return res.status(200).json({ message: 'No expenses found', expenses: [] });
    }

    res.status(200).json({expenses:expenses});
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
});

// POST route for creating a new expense
router.post('/expenses', authenticateUser, async (req, res) => {
  const { title, description, amount, participants } = req.body;

  try {
    const newExpense = new Expense({
      title,
      description,
      amount,
      participants,
      userId: req.user.userId,  // Associate the expense with the authenticated user
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Error creating expense', error: error.message });
  }
});

router.put('/expenses/:expenseId', authenticateUser, async (req, res) => {
  const expenseId = req.params.expenseId;
  const { userId, paidAmount } = req.body;

  // Validate expenseId
  if (!mongoose.Types.ObjectId.isValid(expenseId)) {
    return res.status(400).json({ message: 'Invalid expense ID' });
  }

  // Validate request body
  if (!userId || paidAmount == null) {
    return res.status(400).json({ message: 'userId and paidAmount are required' });
  }

  try {
    const expense = await Expense.findOne({ _id: expenseId, userId: req.user.userId });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or access denied' });
    }

    const paymentIndex = expense.paidAmounts.findIndex((p) => p.userId === userId);

    if (paymentIndex !== -1) {
      expense.paidAmounts[paymentIndex].amount = paidAmount;
    } else {
      expense.paidAmounts.push({ userId, amount: paidAmount });
    }

    const updatedExpense = await expense.save();
    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Error updating expense', error: error.message });
  }
});



router.delete('/expenses/:id', authenticateUser, async (req, res) => {
  try {
    const expenseId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    const deletedExpense = await Expense.findOneAndDelete({
      _id: expenseId,
      userId: req.user.userId,
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found or access denied' });
    }

    res.status(200).json({ message: 'Expense deleted successfully', expense: deletedExpense });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Failed to delete expense', error: error.message });
  }
});


module.exports = router;
