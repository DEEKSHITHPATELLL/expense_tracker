const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value) && value > 0;
      },
      message: 'Amount must be a valid positive number'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: {
      values: [
        'Food & Dining',
        'Transportation',
        'Shopping',
        'Entertainment',
        'Bills & Utilities',
        'Healthcare',
        'Travel',
        'Education',
        'Personal Care',
        'Gifts & Donations',
        'Business',
        'Home Loans',
        'Other'
      ],
      message: 'Please select a valid category'
    }
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Date cannot be in the future'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for better query performance
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index({ userId: 1, createdAt: -1 });

// Virtual for formatted amount (for display purposes)
expenseSchema.virtual('formattedAmount').get(function() {
  return `$${this.amount.toFixed(2)}`;
});

// Static method to get expenses by user with filters
expenseSchema.statics.getExpensesByUser = async function(userId, filters = {}) {
  const query = { userId };
  
  // Add date range filter
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.date.$lte = new Date(filters.endDate);
    }
  }
  
  // Add category filter
  if (filters.category && filters.category !== 'all') {
    query.category = filters.category;
  }
  
  // Add amount range filter
  if (filters.minAmount !== undefined) {
    query.amount = { ...query.amount, $gte: filters.minAmount };
  }
  if (filters.maxAmount !== undefined) {
    query.amount = { ...query.amount, $lte: filters.maxAmount };
  }
  
  return this.find(query)
    .sort({ date: -1, createdAt: -1 })
    .populate('userId', 'name email');
};

// Static method to get expense statistics
expenseSchema.statics.getExpenseStats = async function(userId, filters = {}) {
  const matchStage = { userId: new mongoose.Types.ObjectId(userId) };
  
  // Add date range filter
  if (filters.startDate || filters.endDate) {
    matchStage.date = {};
    if (filters.startDate) {
      matchStage.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      matchStage.date.$lte = new Date(filters.endDate);
    }
  }
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalExpenses: { $sum: 1 },
        avgAmount: { $avg: '$amount' },
        maxAmount: { $max: '$amount' },
        minAmount: { $min: '$amount' }
      }
    }
  ]);
  
  const categoryStats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);
  
  return {
    overall: stats[0] || {
      totalAmount: 0,
      totalExpenses: 0,
      avgAmount: 0,
      maxAmount: 0,
      minAmount: 0
    },
    byCategory: categoryStats
  };
};

module.exports = mongoose.model('Expense', expenseSchema);
