import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAllUsers } from './usersSlice';

const Leaderboard = () => {
  const users = useSelector(selectAllUsers);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filterAndSortUsers = () => {
      let filtered = [...users];

      // Apply time range filter
      if (timeRange !== 'all') {
        const now = new Date();
        const cutoff = new Date();
        switch (timeRange) {
          case 'week':
            cutoff.setDate(now.getDate() - 7);
            break;
          case 'month':
            cutoff.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            cutoff.setFullYear(now.getFullYear() - 1);
            break;
          default:
            break;
        }
        filtered = filtered.filter(user => 
          user.activities.some(activity => new Date(activity.timestamp) > cutoff)
        );
      }

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Sort by points
      filtered.sort((a, b) => b.points - a.points);
      setSortedUsers(filtered);
    };

    filterAndSortUsers();
  }, [users, timeRange, searchQuery]);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>

      <div className="leaderboard-controls">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="time-range-select"
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="leaderboard-list">
        {sortedUsers.map((user, index) => (
          <div key={user.id} className="leaderboard-item">
            <div className="rank">#{index + 1}</div>
            <div className="user-info">
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-details">
                <h3>{user.name}</h3>
                <p className="user-title">{user.title || 'Member'}</p>
              </div>
            </div>
            <div className="user-stats">
              <div className="points">
                <span className="points-value">{user.points}</span>
                <span className="points-label">Points</span>
              </div>
              <div className="achievements">
                <span className="achievements-value">
                  {user.achievements?.length || 0}
                </span>
                <span className="achievements-label">Achievements</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
