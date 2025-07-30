import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  IndianRupee,
  LayoutDashboard,
  Receipt,
  BarChart3,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/expenses',
      label: 'Expenses',
      icon: Receipt
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: BarChart3
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: User
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <Link to="/dashboard" className="navbar-brand">
            <IndianRupee size={24} style={{ marginRight: '0.5rem' }} />
            ExpenseTracker
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav" style={{ display: window.innerWidth >= 768 ? 'flex' : 'none' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
            
            <div style={{ marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginRight: '1rem' }}>
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn btn-outline btn-sm"
            style={{ display: window.innerWidth < 768 ? 'flex' : 'none' }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div 
            className="navbar-nav" 
            style={{ 
              flexDirection: 'column', 
              marginTop: '1rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid var(--border-color)',
              display: window.innerWidth < 768 ? 'flex' : 'none'
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
            
            <div style={{ 
              marginTop: '1rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                style={{ alignSelf: 'flex-start' }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
