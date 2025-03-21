import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectAuthStatus, checkAuth } from './features/auth/authSlice';
import Dashboard from './components/Dashboard';
import RewardList from './components/rewards/RewardList';
import RewardDetail from './features/rewards/RewardDetail';
import UserProfile from './features/users/UserProfile';
import Login from './features/auth/Login';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboard from './features/admin/AdminDashboard';
import Activities from './features/activities/Activities';
import UserManagement from './features/admin/UserManagement';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const authStatus = useSelector(selectAuthStatus);

  useEffect(() => {
    if (authStatus === 'idle') {
      dispatch(checkAuth());
    }
  }, [dispatch, authStatus]);

  if (authStatus === 'loading') {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {user && <Navbar />}
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activities"
              element={
                <ProtectedRoute>
                  <Activities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewards"
              element={
                <ProtectedRoute>
                  <RewardList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewards/:id"
              element={
                <ProtectedRoute>
                  <RewardDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
