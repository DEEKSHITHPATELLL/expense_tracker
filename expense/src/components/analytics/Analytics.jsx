import React, { useState, useEffect } from 'react';
import { expensesAPI } from '../../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Calendar, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
    endDate: new Date().toISOString().split('T')[0] // Today
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      const [statsResponse, expensesResponse] = await Promise.all([
        expensesAPI.getStats(dateRange),
        expensesAPI.getExpenses({
          ...dateRange,
          limit: 1000, // Get all expenses for the period
          sortBy: 'date',
          sortOrder: 'asc'
        })
      ]);

      setStats(statsResponse.data.stats);
      
      // Process monthly data
      const expenses = expensesResponse.data.expenses;
      const monthlyMap = {};
      
      expenses.forEach(expense => {
        const date = new Date(expense.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = {
            month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            amount: 0,
            count: 0
          };
        }
        
        monthlyMap[monthKey].amount += expense.amount;
        monthlyMap[monthKey].count += 1;
      });
      
      const monthlyArray = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));
      setMonthlyData(monthlyArray);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const categoryData = stats?.byCategory?.map((item, index) => ({
    name: item._id,
    value: item.totalAmount,
    count: item.count,
    color: COLORS[index % COLORS.length]
  })) || [];

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div className="mb-6">
        <h1>Analytics</h1>
        <p>Detailed insights into your spending patterns</p>
      </div>

      {/* Date Range Filter */}
      <div className="filters mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Calendar size={20} />
          <h3 style={{ margin: 0 }}>Date Range</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="form-input"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-value">
            {formatCurrency(stats?.overall?.totalAmount || 0)}
          </div>
          <div className="stat-label">Total Spent</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {stats?.overall?.totalExpenses || 0}
          </div>
          <div className="stat-label">Total Transactions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {formatCurrency(stats?.overall?.avgAmount || 0)}
          </div>
          <div className="stat-label">Average Transaction</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {formatCurrency(stats?.overall?.maxAmount || 0)}
          </div>
          <div className="stat-label">Highest Transaction</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Monthly Spending Trend */}
        <div className="card">
          <div className="card-header">
            <h3>
              <TrendingUp size={20} style={{ marginRight: '0.5rem' }} />
              Monthly Spending Trend
            </h3>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📈</div>
              <p>No data available for the selected period</p>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3>
              <PieChartIcon size={20} style={{ marginRight: '0.5rem' }} />
              Spending by Category
            </h3>
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
              <p>No category data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Category Details Table */}
      {categoryData.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3>Category Breakdown</h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Amount</th>
                <th>Transactions</th>
                <th>Average</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((category) => {
                const percentage = ((category.value / stats.overall.totalAmount) * 100).toFixed(1);
                const average = category.value / category.count;
                
                return (
                  <tr key={category.name}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div 
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: category.color
                          }}
                        />
                        {category.name}
                      </div>
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      {formatCurrency(category.value)}
                    </td>
                    <td>{category.count}</td>
                    <td>{formatCurrency(average)}</td>
                    <td>{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Monthly Bar Chart */}
      {monthlyData.length > 0 && (
        <div className="card mt-6">
          <div className="card-header">
            <h3>Monthly Comparison</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'amount' ? formatCurrency(value) : value,
                  name === 'amount' ? 'Amount' : 'Transactions'
                ]} 
              />
              <Bar dataKey="amount" fill="#3b82f6" name="amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Analytics;
