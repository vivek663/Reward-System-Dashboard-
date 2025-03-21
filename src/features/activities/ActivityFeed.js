import React from 'react';
import { useSelector } from 'react-redux';
import './ActivityFeed.css';

const ActivityFeed = ({ userId }) => {
  const activities = useSelector(state => {
    const user = state.users.entities[userId];
    return user?.activities || [];
  });

  if (activities.length === 0) {
    return (
      <div className="activity-feed empty">
        <p>No activities yet</p>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <div className="feed-list">
        {activities.map((activity, index) => (
          <div key={`${activity.id || index}`} className="feed-item">
            <div className="feed-item-content">
              <div className="activity-header">
                <h4 className="activity-title">{activity.title}</h4>
                <span className="activity-points">+{activity.points} points</span>
              </div>
              {activity.description && (
                <p className="activity-description">{activity.description}</p>
              )}
              <div className="activity-meta">
                <span className="activity-timestamp">
                  {new Date(activity.timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
