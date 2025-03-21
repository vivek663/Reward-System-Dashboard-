import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserById } from '../users/usersSlice';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import './AdminRoutes.css';

const AdminRoutes = () => {
  const userId = useSelector(state => state.auth.userId);
  const currentUser = useSelector(state => selectUserById(state, userId));

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied</h2>
        <p>You do not have permission to access the admin area.</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <p className="admin-user">Welcome, {currentUser.username}</p>
        </div>
        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">👥</span>
            Manage Users
          </NavLink>
          <NavLink
            to="/admin/activities"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📝</span>
            Activities
          </NavLink>
        </nav>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminRoutes;
