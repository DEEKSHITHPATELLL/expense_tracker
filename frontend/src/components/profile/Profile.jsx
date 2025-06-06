import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Calendar, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
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
      await updateProfile(formData);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div className="mb-6">
        <h1>Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Profile Form */}
        <div className="card">
          <div className="card-header">
            <h3>Personal Information</h3>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <User size={16} style={{ marginRight: '0.5rem' }} />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
                maxLength={50}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} style={{ marginRight: '0.5rem' }} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

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
                  Update Profile
                </>
              )}
            </button>
          </form>
        </div>

        {/* Account Information */}
        <div className="card">
          <div className="card-header">
            <h3>Account Information</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User size={16} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ fontWeight: '500' }}>Name</span>
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>{user?.name}</div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ fontWeight: '500' }}>Email</span>
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>{user?.email}</div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ fontWeight: '500' }}>Member Since</span>
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </div>
            </div>

            {user?.updatedAt && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ fontWeight: '500' }}>Last Updated</span>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  {formatDate(user.updatedAt)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="card mt-6">
        <div className="card-header">
          <h3>Account Statistics</h3>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">
              {user?.id ? '1' : '0'}
            </div>
            <div className="stat-label">Active Account</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">
              {user?.createdAt ? Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) : 0}
            </div>
            <div className="stat-label">Days as Member</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">
              ✓
            </div>
            <div className="stat-label">Email Verified</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">
              🔒
            </div>
            <div className="stat-label">Account Secured</div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="card mt-6" style={{ backgroundColor: 'var(--background-color)', border: '1px solid var(--warning-color)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ 
            padding: '0.5rem', 
            backgroundColor: 'var(--warning-color)', 
            borderRadius: 'var(--border-radius)',
            color: 'white',
            fontSize: '1.25rem'
          }}>
            🔐
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--warning-color)' }}>
              Security Tip
            </h4>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Keep your account secure by using a strong password and never sharing your login credentials. 
              If you suspect any unauthorized access, please contact support immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
