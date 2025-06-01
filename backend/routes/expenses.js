const express = require('express');
const router = express.Router();

const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/expenseController');

const auth = require('../middleware/auth');
const { validateExpense } = require('../middleware/validation');

// @route   GET /api/expenses/stats
// @desc    Get expense statistics
// @access  Private
router.get('/stats', auth, getExpenseStats);

// @route   GET /api/expenses
// @desc    Get all expenses for user
// @access  Private
router.get('/', auth, getExpenses);

// @route   GET /api/expenses/:id
// @desc    Get single expense
// @access  Private
router.get('/:id', auth, getExpense);

// @route   POST /api/expenses
// @desc    Create new expense
// @access  Private
router.post('/', auth, validateExpense, createExpense);

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private
router.put('/:id', auth, validateExpense, updateExpense);

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', auth, deleteExpense);

module.exports = router;
