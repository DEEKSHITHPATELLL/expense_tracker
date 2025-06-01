const { validationResult } = require('express-validator');
const Expense = require('../models/expense');

const getExpenses = async (req, res) => {
  try {
    const {
      category,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    const filters = {};
    if (category && category !== 'all') filters.category = category;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (minAmount) filters.minAmount = parseFloat(minAmount);
    if (maxAmount) filters.maxAmount = parseFloat(maxAmount);

    console.log('Get expenses request:', {
      userId: req.user.id,
      filters,
      query: req.query
    });
    const expenses = await Expense.getExpensesByUser(req.user.id, filters);

    console.log('Found expenses:', expenses.length);

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    
    const paginatedExpenses = expenses
      .sort((a, b) => {
        if (sortBy === 'date') {
          return sortOrder === 'desc' 
            ? new Date(b.date) - new Date(a.date)
            : new Date(a.date) - new Date(b.date);
        }
        if (sortBy === 'amount') {
          return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
        }
        if (sortBy === 'title') {
          return sortOrder === 'desc' 
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        }
        return 0;
      })
      .slice(startIndex, endIndex);

    const totalExpenses = expenses.length;
    const totalPages = Math.ceil(totalExpenses / parseInt(limit));

    res.json({
      success: true,
      data: {
        expenses: paginatedExpenses,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalExpenses,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching expenses'
    });
  }
};
const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: { expense }
    });

  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching expense'
    });
  }
};


const createExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, amount, category, date, description } = req.body;

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      description,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: { expense }
    });

  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating expense'
    });
  }
};
const updateExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, amount, category, date, description } = req.body;

    let expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, category, date, description },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: { expense }
    });

  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating expense'
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });

  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting expense'
    });
  }
};
const getExpenseStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    console.log('Get stats request:', {
      userId: req.user.id,
      filters,
      query: req.query
    });

    const stats = await Expense.getExpenseStats(req.user.id, filters);

    console.log('Stats result:', stats);

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get expense stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching expense statistics'
    });
  }
};

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
};
