import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { expensesAPI } from '../../services/api.js';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ExpenseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExpense, setIsLoadingExpense] = useState(isEditing);

  const categories = [
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
    'Other'
  ];

  useEffect(() => {
    if (isEditing) {
      fetchExpense();
    }
  }, [id, isEditing]);

  const fetchExpense = async () => {
    try {
      setIsLoadingExpense(true);
      const response = await expensesAPI.getExpense(id);
      const expense = response.data.data.expense;
      
      setFormData({
        title: expense.title,
        amount: expense.amount.toString(),
        category: expense.category,
        date: new Date(expense.date).toISOString().split('T')[0],
        description: expense.description || ''
      });
    } catch (error) {
      console.error('Error fetching expense:', error);
      toast.error('Failed to load expense');
      navigate('/expenses');
    } finally {
      setIsLoadingExpense(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (new Date(formData.date) > new Date()) {
      newErrors.date = 'Date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (isEditing) {
        await expensesAPI.updateExpense(id, expenseData);
        toast.success('Expense updated successfully');
      } else {
        await expensesAPI.createExpense(expenseData);
        toast.success('Expense created successfully');
      }

      navigate('/expenses');
    } catch (error) {
      console.error('Error saving expense:', error);
      const message = error.response?.data?.message || 'Failed to save expense';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingExpense) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/expenses')}
          className="btn btn-outline"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1>{isEditing ? 'Edit Expense' : 'Add New Expense'}</h1>
          <p>{isEditing ? 'Update your expense details' : 'Record a new expense'}</p>
        </div>
      </div>

      {/* Form */}
      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Enter expense title"
              maxLength={100}
            />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                Amount *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={`form-input ${errors.amount ? 'error' : ''}`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.amount && <div className="form-error">{errors.amount}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-select ${errors.category ? 'error' : ''}`}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <div className="form-error">{errors.category}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`form-input ${errors.date ? 'error' : ''}`}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <div className="form-error">{errors.date}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              placeholder="Optional description"
              rows={3}
              maxLength={500}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {formData.description.length}/500 characters
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <div className="spinner" style={{ width: '1rem', height: '1rem' }} />
              ) : (
                <>
                  <Save size={20} />
                  {isEditing ? 'Update Expense' : 'Save Expense'}
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/expenses')}
              className="btn btn-outline"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
