import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTopUsers, setStatus } from '../users/usersSlice';
import { debounce } from 'lodash';
import './Leaderboard.css';

const Leaderboard = () => {
  const dispatch = useDispatch();
  const topUsers = useSelector(state => selectTopUsers(state, 100));
  const [sortOrder, setSortOrder] = useState('desc');
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeLeaderboard = async () => {
      try {
        // In a real app, you would fetch users data here
        setIsLoading(false);
        dispatch(setStatus('succeeded'));
      } catch (error) {
        dispatch(setStatus('failed'));
        setIsLoading(false);
      }
    };

    initializeLeaderboard();
  }, [dispatch]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    [setSearchQuery]
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  // Filter and sort users
  const filteredAndSortedUsers = topUsers
    .filter(user => {
      // Apply search filter
      if (searchQuery) {
        return user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               user.email.toLowerCase().includes(searchQuery.toLowerCase());
      }

      // Apply time filter
      if (timeFilter !== 'all') {
        const now = new Date();
        const activityDate = user.lastActivity ? new Date(user.lastActivity) : null;
        
        if (!activityDate) return false;

        switch (timeFilter) {
          case 'day':
            return activityDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            return activityDate >= weekAgo;
          case 'month':
            return activityDate.getMonth() === now.getMonth() &&
                   activityDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by points
      const comparison = b.points - a.points;
      return sortOrder === 'desc' ? comparison : -comparison;
    });

  const getUserLevel = (points) => {
    const level = Math.floor(points / 100) + 1;
    const progress = (points % 100) / 100;
    return { level, progress };
  };

  if (isLoading) {
    return (
      <div className="leaderboard-loading">
        Loading leaderboard...
      </div>
    );
  }

  if (!filteredAndSortedUsers.length) {
    return (
      <div className="leaderboard">
        <div className="leaderboard-header">
          <h1>Leaderboard</h1>
          <div className="leaderboard-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name or email..."
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
          </div>
        </div>
        <div className="leaderboard-empty">
          No users found matching your criteria
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h1>Leaderboard</h1>
        <div className="leaderboard-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or email..."
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="time-filter"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
              <option value="day">Today</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="sort-button"
              title={sortOrder === 'desc' ? 'Highest points first' : 'Lowest points first'}
            >
              {sortOrder === 'desc' ? '↓ Points' : '↑ Points'}
            </button>
          </div>
        </div>
      </div>

      <div className="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Points</th>
              <th>Level</th>
              <th>Recent Activity</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUsers.map((user, index) => {
              const { level, progress } = getUserLevel(user.points);
              return (
                <tr key={user.id} className={index < 3 ? `top-${index + 1}` : ''}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      {index < 3 && (
                        <span className={`trophy trophy-${index + 1}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{user.points}</td>
                  <td>
                    <div className="level-info">
                      <span>Level {level}</span>
                      <div className="level-progress">
                        <div 
                          className="progress-bar"
                          style={{ width: `${progress * 100}%` }}
                          title={`${Math.round(progress * 100)}% to next level`}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    {user.lastActivity || 'No recent activity'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
