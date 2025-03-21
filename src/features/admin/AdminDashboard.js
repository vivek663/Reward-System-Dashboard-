import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllUsers, fetchUsersAdmin } from '../users/usersSlice';
import { selectAllRewards } from '../rewards/rewardsSlice';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const rewards = useSelector(selectAllRewards);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchUsersAdmin());
  }, [dispatch]);

  // Calculate analytics
  const totalUsers = users?.length || 0;
  const totalPoints = users?.reduce((sum, user) => sum + (user.points || 0), 0) || 0;
  const averagePoints = totalUsers ? Math.round(totalPoints / totalUsers) : 0;
  const activeUsers = users?.filter(user => 
    user.lastActivity && 
    new Date(user.lastActivity).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  ).length || 0;

  // Process activities from all users
  const allActivities = users?.flatMap(user => 
    (user.activities || []).map(activity => ({
      ...activity,
      userId: user.id,
      userName: user.username || 'Unknown User',
      userPoints: user.points || 0,
      timestamp: activity.timestamp || new Date().toISOString()
    }))
  ) || [];

  // Sort activities by timestamp (most recent first)
  const recentActivities = allActivities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);

  const topUsers = [...(users || [])]
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 5);

  const formatPoints = (points) => {
    return points?.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      style: 'decimal'
    }) || '0';
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="user-points">
            <span className="points-label">Total Points:</span>
            <span className="navbar-points-badge">{formatPoints(totalPoints)} pts</span>
          </div>
        </div>
        <div className="admin-tabs">
          <div className="tabs-container">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button 
              className={`tab-button ${activeTab === 'activities' ? 'active' : ''}`}
              onClick={() => setActiveTab('activities')}
            >
              Activities
            </button>
            <button 
              className={`tab-button ${activeTab === 'rewards' ? 'active' : ''}`}
              onClick={() => setActiveTab('rewards')}
            >
              Rewards
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="analytics-icon">👥</div>
              <div className="analytics-content">
                <h3>Total Users</h3>
                <p className="analytics-value">{totalUsers}</p>
              </div>
            </div>
            <div className="analytics-card">
              <div className="analytics-icon">🎯</div>
              <div className="analytics-content">
                <h3>Active Users (7d)</h3>
                <p className="analytics-value">{activeUsers}</p>
              </div>
            </div>
            <div className="analytics-card">
              <div className="analytics-icon">⭐</div>
              <div className="analytics-content">
                <h3>Total Points</h3>
                <p className="analytics-value points-value">{formatPoints(totalPoints)} pts</p>
              </div>
            </div>
            <div className="analytics-card">
              <div className="analytics-icon">📊</div>
              <div className="analytics-content">
                <h3>Avg. Points/User</h3>
                <p className="analytics-value points-value">{formatPoints(averagePoints)} pts</p>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="top-users-section">
              <h2>Top Users</h2>
              <div className="top-users-list">
                {topUsers.map((user, index) => (
                  <div key={user.id} className="top-user-card">
                    <div className="rank">{index + 1}</div>
                    <div className="user-info">
                      <span className="username">{user.username}</span>
                      <span className="points points-badge">
                        {formatPoints(user.points)} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="recent-activities">
              <h2>Recent Activities</h2>
              <div className="activities-table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Activity</th>
                      <th>Points</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map((activity, index) => (
                      <tr key={index}>
                        <td>{activity.userName}</td>
                        <td>{activity.title}</td>
                        <td className="points-cell">
                          <span className="points-change">
                            {activity.points >= 0 ? '+' : ''}{formatPoints(activity.points)}
                          </span>
                        </td>
                        <td>{new Date(activity.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="users-section">
          <h2>User Management</h2>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Points</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="points-cell">
                      <span className="points-badge">
                        {formatPoints(user.points)} pts
                      </span>
                    </td>
                    <td>{user.lastActivity ? new Date(user.lastActivity).toLocaleString() : 'Never'}</td>
                    <td>
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="activities-section">
          <h2>Activity Log</h2>
          <div className="activities-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Activity</th>
                  <th>Points</th>
                  <th>Total Points</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {allActivities.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.userName}</td>
                    <td>{activity.title}</td>
                    <td className="points-cell">
                      <span className={`points-change ${activity.points >= 0 ? 'positive' : 'negative'}`}>
                        {activity.points >= 0 ? '+' : ''}{formatPoints(activity.points)}
                      </span>
                    </td>
                    <td className="points-cell">
                      <span className="points-total">{formatPoints(activity.userPoints)}</span>
                    </td>
                    <td>{new Date(activity.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="rewards-section">
          <h2>Rewards Management</h2>
          <div className="rewards-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Points Required</th>
                  <th>Stock</th>
                  <th>Claimed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rewards?.map(reward => (
                  <tr key={reward.id}>
                    <td>{reward.title}</td>
                    <td className="points-cell">
                      <span className="points-required">
                        {formatPoints(reward.points)} pts
                      </span>
                    </td>
                    <td>{reward.stock || 0}</td>
                    <td>{reward.claimed || 0}</td>
                    <td>
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
