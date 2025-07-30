import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { expensesAPI } from '../../services/api.js';
import {
  IndianRupee,
  TrendingUp,
  Receipt,
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Get all-time stats (remove date filters to show all expenses)
      console.log('Fetching all-time dashboard data...');

      const [statsResponse, expensesResponse] = await Promise.all([
        expensesAPI.getStats({}), // No date filters = all time
        expensesAPI.getExpenses({ limit: 5, sortBy: 'date', sortOrder: 'desc' })
      ]);

      console.log('Dashboard stats response:', statsResponse.data.data.stats);
      console.log('Dashboard recent expenses:', expensesResponse.data.data.expenses);

      setStats(statsResponse.data.data.stats || {});
      setRecentExpenses(expensesResponse.data.data.expenses || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const categoryData = stats?.byCategory?.map((item, index) => ({
    name: item._id,
    value: item.totalAmount,
    color: COLORS[index % COLORS.length]
  })) || [];

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of all your expenses</p>
        </div>
        <Link to="/expenses/new" className="btn btn-primary">
          <Plus size={20} />
          Add Expense
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <div className="stat-value">
                {formatCurrency(stats?.overall?.totalAmount || 0)}
              </div>
              <div className="stat-label">Total Spent All Time</div>
            </div>
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: 'var(--primary-color)', 
              borderRadius: 'var(--border-radius)',
              color: 'white'
            }}>
              <IndianRupee size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <div className="stat-value">
                {stats?.overall?.totalExpenses || 0}
              </div>
              <div className="stat-label">Total Transactions</div>
            </div>
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: 'var(--success-color)', 
              borderRadius: 'var(--border-radius)',
              color: 'white'
            }}>
              <Receipt size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <div className="stat-value">
                {formatCurrency(stats?.overall?.avgAmount || 0)}
              </div>
              <div className="stat-label">Average per Transaction</div>
            </div>
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: 'var(--warning-color)', 
              borderRadius: 'var(--border-radius)',
              color: 'white'
            }}>
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <div className="stat-value">
                {formatCurrency(stats?.overall?.maxAmount || 0)}
              </div>
              <div className="stat-label">Highest Transaction</div>
            </div>
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: 'var(--danger-color)', 
              borderRadius: 'var(--border-radius)',
              color: 'white'
            }}>
              <ArrowUpRight size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Expenses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        {/* Category Breakdown Chart */}
        <div className="card">
          <div className="card-header">
            <h3>Spending by Category</h3>
          </div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <p>No expenses to display</p>
            </div>
          )}
        </div>

        {/* Recent Expenses */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h3>Recent Expenses</h3>
              <Link to="/expenses" className="btn btn-outline btn-sm">
                View All
              </Link>
            </div>
          </div>
          {recentExpenses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentExpenses.map((expense) => (
                <div 
                  key={expense._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: 'var(--background-color)',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {expense.title}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {expense.category} • {formatDate(expense.date)}
                    </div>
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--danger-color)' }}>
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <p>No recent expenses</p>
              <Link to="/expenses/new" className="btn btn-primary btn-sm mt-4">
                Add Your First Expense
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
