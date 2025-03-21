import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import UserManagement from './UserManagement';
import ActivityManagement from './ActivityManagement';
import RewardManager from './RewardManager';

const AdminDashboard = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <nav className="admin-nav">
          <Link 
            to="/admin/users" 
            className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
          >
            User Management
          </Link>
          <Link 
            to="/admin/activities" 
            className={`nav-link ${isActive('/admin/activities') ? 'active' : ''}`}
          >
            Activity Log
          </Link>
          <Link 
            to="/admin/rewards" 
            className={`nav-link ${isActive('/admin/rewards') ? 'active' : ''}`}
          >
            Reward Management
          </Link>
        </nav>
      </div>

      <div className="admin-content">
        <Routes>
          <Route path="/users" element={<UserManagement />} />
          <Route path="/activities" element={<ActivityManagement />} />
          <Route path="/rewards" element={<RewardManager />} />
          <Route 
            path="/" 
            element={
              <div className="admin-overview">
                <div className="overview-grid">
                  <div className="overview-card">
                    <h3>Users</h3>
                    <div className="card-content">
                      <Link to="/admin/users" className="card-link">
                        Manage Users
                      </Link>
                    </div>
                  </div>
                  
                  <div className="overview-card">
                    <h3>Activities</h3>
                    <div className="card-content">
                      <Link to="/admin/activities" className="card-link">
                        View Activity Log
                      </Link>
                    </div>
                  </div>
                  
                  <div className="overview-card">
                    <h3>Rewards</h3>
                    <div className="card-content">
                      <Link to="/admin/rewards" className="card-link">
                        Manage Rewards
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            } 
          />
        </Routes>
      </div>

      <style jsx>{`
        .admin-dashboard {
          padding: var(--spacing-6);
        }

        .admin-header {
          margin-bottom: var(--spacing-6);
        }

        h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: var(--spacing-4);
        }

        .admin-nav {
          display: flex;
          gap: var(--spacing-4);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--spacing-6);
        }

        .nav-link {
          padding: var(--spacing-3) var(--spacing-4);
          color: var(--color-text);
          text-decoration: none;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: var(--color-primary);
        }

        .nav-link.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }

        .admin-content {
          background-color: var(--color-white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
        }

        .admin-overview {
          padding: var(--spacing-6);
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-6);
        }

        .overview-card {
          background-color: var(--color-background);
          border-radius: var(--border-radius);
          padding: var(--spacing-4);
        }

        .overview-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: var(--spacing-4);
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .card-link {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-2);
          color: var(--color-primary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .card-link:hover {
          color: var(--color-primary-dark);
        }

        @media (max-width: 768px) {
          .admin-nav {
            flex-direction: column;
            gap: 0;
          }

          .nav-link {
            padding: var(--spacing-3);
          }

          .nav-link.active {
            background-color: var(--color-background);
            border-bottom: none;
            border-left: 2px solid var(--color-primary);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
