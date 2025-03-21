import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchActivities,
  selectAllActivities,
  selectActivitiesStatus,
  selectActivitiesError
} from './activitiesSlice';
import './Activities.css';

const Activities = () => {
  const dispatch = useDispatch();
  const activities = useSelector(selectAllActivities);
  const status = useSelector(selectActivitiesStatus);
  const error = useSelector(selectActivitiesError);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        await dispatch(fetchActivities()).unwrap();
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [dispatch]);

  if (loading || status === 'loading') {
    return (
      <div className="activities-container">
        <div className="activities-loading">
          <div className="loader"></div>
          <p>Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activities-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activities-container">
      <div className="activities-header">
        <h1>Activities</h1>
        <div className="user-points">
          <span className="points-label">Total Points</span>
          <span className="points-value">
            {activities.reduce((sum, activity) => 
              sum + (activity.status === 'completed' ? activity.points : 0), 0
            ).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="activities-grid">
        {activities.map(activity => (
          <div key={activity.id} className="activity-card">
            <div className="activity-header">
              <h3>{activity.title}</h3>
              <span className={`status-badge ${activity.status}`}>
                {activity.status}
              </span>
            </div>
            <p className="activity-description">{activity.description}</p>
            <div className="activity-footer">
              <span className="activity-points">
                {activity.points} points
              </span>
              {activity.completedAt && (
                <span className="activity-completed">
                  Completed {new Date(activity.completedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
