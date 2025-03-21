import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllUsers } from '../users/usersSlice';
import './Activities.css';

const Activities = () => {
  const [isLoading, setIsLoading] = useState(true);
  const users = useSelector(selectAllUsers);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadActivities = async () => {
      try {
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
        const sortedActivities = allActivities.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setActivities(sortedActivities);
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, [users]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="activities-page">
      <div className="activities-header">
        <h2>User Activities</h2>
        <p>Track all user activities and points earned</p>
      </div>

      <div className="activities-list">
        {activities.map((activity, index) => (
          <div key={`${activity.userId}-${index}`} className="activity-card">
            <div className="activity-header">
              <div className="user-info">
                <span className="username">{activity.userName}</span>
                <span className="points">+{activity.points} points</span>
              </div>
              <span className="timestamp">
                {new Date(activity.timestamp).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="activity-content">
              <p className="activity-title">{activity.title}</p>
              {activity.description && (
                <p className="activity-description">{activity.description}</p>
              )}
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="no-activities">
            <p>No activities found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
