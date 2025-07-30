import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { expensesAPI } from '../../services/api.js';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  IndianRupee,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalExpenses: 0
  });

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
    fetchExpenses();
  }, [filters, pagination.currentPage]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await expensesAPI.getExpenses({
        ...filters,
        page: pagination.currentPage,
        limit: 10
      });
      
      setExpenses(response.data.data.expenses || []);
      setPagination(response.data.data.pagination || {});
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to fetch expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await expensesAPI.deleteExpense(id);
      toast.success('Expense deleted successfully');
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      search: ''
    });
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Expenses</h1>
          <p>Manage and track all your expenses</p>
        </div>
        <Link to="/expenses/new" className="btn btn-primary">
          <Plus size={20} />
          Add Expense
        </Link>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ margin: 0 }}>
            <Filter size={20} style={{ marginRight: '0.5rem' }} />
            Filters
          </h3>
          <button onClick={clearFilters} className="btn btn-outline btn-sm">
            Clear All
          </button>
        </div>
        
        <div className="filters-grid">
          <div className="form-group">
            <label className="form-label">Search</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search expenses..."
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)'
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Min Amount</label>
            <input
              type="number"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              placeholder="0.00"
              className="form-input"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Max Amount</label>
            <input
              type="number"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              placeholder="1000.00"
              className="form-input"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : expenses.length > 0 ? (
        <>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500' }}>{expense.title}</div>
                        {expense.description && (
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {expense.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: 'var(--background-color)',
                        borderRadius: 'var(--border-radius)',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {expense.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--danger-color)' }}>
                      {formatCurrency(expense.amount)}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {formatDate(expense.date)}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          to={`/expenses/edit/${expense._id}`}
                          className="btn btn-outline btn-sm"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="btn btn-danger btn-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="btn btn-outline"
              >
                Previous
              </button>
              
              <span style={{ color: 'var(--text-secondary)' }}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="btn btn-outline"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3>No expenses found</h3>
            <p>Start by adding your first expense or adjust your filters</p>
            <Link to="/expenses/new" className="btn btn-primary mt-4">
              <Plus size={20} />
              Add Your First Expense
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
