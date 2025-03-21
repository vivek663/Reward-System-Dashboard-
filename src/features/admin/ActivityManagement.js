import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllActivities } from '../activities/activitiesSlice';
import { addActivity, updateActivity, removeActivity } from '../activities/activitiesSlice';

const ActivityManagement = () => {
  const dispatch = useDispatch();
  const activities = useSelector(selectAllActivities);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'daily',
    pointsReward: 0,
    requiresVerification: false,
    startDate: '',
    endDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'pointsReward' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingActivity) {
      dispatch(updateActivity({ id: editingActivity.id, ...formData }));
      setEditingActivity(null);
    } else {
      dispatch(addActivity({
        id: Date.now().toString(),
        ...formData,
        status: 'active',
        completions: 0,
      }));
    }
    setFormData({
      name: '',
      description: '',
      type: 'daily',
      pointsReward: 0,
      requiresVerification: false,
      startDate: '',
      endDate: '',
    });
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description,
      type: activity.type,
      pointsReward: activity.pointsReward,
      requiresVerification: activity.requiresVerification,
      startDate: activity.startDate || '',
      endDate: activity.endDate || '',
    });
  };

  const handleDelete = (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      dispatch(removeActivity(activityId));
    }
  };

  const handleStatusToggle = (activity) => {
    dispatch(updateActivity({
      id: activity.id,
      status: activity.status === 'active' ? 'inactive' : 'active',
    }));
  };

  return (
    <div className="admin-section">
      <h2>Activity Management</h2>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="one-time">One Time</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="pointsReward">Points Reward</label>
          <input
            type="number"
            id="pointsReward"
            name="pointsReward"
            value={formData.pointsReward}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="requiresVerification"
              checked={formData.requiresVerification}
              onChange={handleInputChange}
            />
            Requires Verification
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="button button-primary">
          {editingActivity ? 'Update Activity' : 'Add Activity'}
        </button>
        {editingActivity && (
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setEditingActivity(null);
              setFormData({
                name: '',
                description: '',
                type: 'daily',
                pointsReward: 0,
                requiresVerification: false,
                startDate: '',
                endDate: '',
              });
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="activities-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Points</th>
              <th>Status</th>
              <th>Completions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => (
              <tr key={activity.id}>
                <td>{activity.name}</td>
                <td>{activity.type}</td>
                <td>{activity.pointsReward}</td>
                <td>
                  <button
                    className={`button button-small ${
                      activity.status === 'active' ? 'button-success' : 'button-warning'
                    }`}
                    onClick={() => handleStatusToggle(activity)}
                  >
                    {activity.status}
                  </button>
                </td>
                <td>{activity.completions || 0}</td>
                <td>
                  <button
                    className="button button-small"
                    onClick={() => handleEdit(activity)}
                  >
                    Edit
                  </button>
                  <button
                    className="button button-small button-danger"
                    onClick={() => handleDelete(activity.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityManagement;
