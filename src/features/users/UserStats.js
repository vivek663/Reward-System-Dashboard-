import React from 'react';
import './UserStats.css';

const UserStats = ({ user }) => {
  // Calculate percentages for progress bars
  const pointsPercentage = (user.points / 10000) * 100; // Assuming 10000 is max points
  const activitiesPercentage = (user.stats.activitiesCompleted / 100) * 100; // Assuming 100 is target
  const rewardsPercentage = (user.stats.rewardsClaimed / 20) * 100; // Assuming 20 is target

  return (
    <div className="user-stats">
      <div className="stats-grid">
        {/* Points Progress */}
        <div className="stat-card">
          <div className="stat-header">
            <h3>Points Progress</h3>
            <span className="stat-value">{user.points}/10,000</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(pointsPercentage, 100)}%` }}
            />
          </div>
          <div className="stat-footer">
            <span>Total Earned: {user.stats.totalPointsEarned}</span>
            <span>Total Spent: {user.stats.totalPointsSpent}</span>
          </div>
        </div>

        {/* Activities Progress */}
        <div className="stat-card">
          <div className="stat-header">
            <h3>Activities</h3>
            <span className="stat-value">{user.stats.activitiesCompleted}/100</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(activitiesPercentage, 100)}%` }}
            />
          </div>
          <div className="stat-footer">
            <span>Daily Goal: 3</span>
            <span>Weekly Goal: 15</span>
          </div>
        </div>

        {/* Rewards Progress */}
        <div className="stat-card">
          <div className="stat-header">
            <h3>Rewards</h3>
            <span className="stat-value">{user.stats.rewardsClaimed}/20</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(rewardsPercentage, 100)}%` }}
            />
          </div>
          <div className="stat-footer">
            <span>Available: {Math.floor(user.points / 100)}</span>
            <span>Claimed: {user.stats.rewardsClaimed}</span>
          </div>
        </div>
      </div>

      {/* Achievement Cards */}
      <div className="achievements-section">
        <h3>Recent Achievements</h3>
        <div className="achievements-grid">
          <div className="achievement-card">
            <div className="achievement-icon">🎯</div>
            <div className="achievement-info">
              <h4>First Steps</h4>
              <p>Complete your first activity</p>
              <span className="achievement-status completed">Completed</span>
            </div>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon">⭐</div>
            <div className="achievement-info">
              <h4>Point Collector</h4>
              <p>Earn 1,000 points</p>
              <span className="achievement-status completed">Completed</span>
            </div>
          </div>

          <div className="achievement-card locked">
            <div className="achievement-icon">🏆</div>
            <div className="achievement-info">
              <h4>Top Performer</h4>
              <p>Reach top 10 on leaderboard</p>
              <span className="achievement-status">In Progress</span>
            </div>
          </div>

          <div className="achievement-card locked">
            <div className="achievement-icon">🔥</div>
            <div className="achievement-info">
              <h4>Streak Master</h4>
              <p>Maintain a 30-day streak</p>
              <span className="achievement-status">
                {user.streaks.current}/30 days
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
