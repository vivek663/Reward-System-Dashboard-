import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRewardsAsync,
  createRewardAsync,
  updateRewardAsync,
  deleteRewardAsync,
  selectAllRewards,
  selectRewardsStatus
} from '../../features/rewards/rewardsSlice';

const RewardManager = () => {
  const dispatch = useDispatch();
  const rewards = useSelector(selectAllRewards);
  const status = useSelector(selectRewardsStatus);
  const [selectedReward, setSelectedReward] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: '',
    stock: '',
    category: 'food'
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRewardsAsync());
    }
  }, [status, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rewardData = {
      ...formData,
      points: Number(formData.points),
      stock: Number(formData.stock)
    };

    try {
      if (selectedReward) {
        await dispatch(updateRewardAsync({
          rewardId: selectedReward.id,
          updateData: rewardData
        })).unwrap();
        setSelectedReward(null);
      } else {
        await dispatch(createRewardAsync(rewardData)).unwrap();
      }
      setFormData({
        title: '',
        description: '',
        points: '',
        stock: '',
        category: 'food'
      });
    } catch (error) {
      console.error('Failed to save reward:', error);
    }
  };

  const handleEdit = (reward) => {
    setSelectedReward(reward);
    setFormData({
      title: reward.title,
      description: reward.description,
      points: reward.points.toString(),
      stock: reward.stock.toString(),
      category: reward.category
    });
  };

  const handleDelete = async (rewardId) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      try {
        await dispatch(deleteRewardAsync(rewardId)).unwrap();
      } catch (error) {
        console.error('Failed to delete reward:', error);
      }
    }
  };

  return (
    <div className="reward-manager">
      <h2>{selectedReward ? 'Edit Reward' : 'Create New Reward'}</h2>
      
      <form onSubmit={handleSubmit} className="reward-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
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

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="points">Points</label>
            <input
              type="number"
              id="points"
              name="points"
              value={formData.points}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="food">Food & Beverage</option>
              <option value="entertainment">Entertainment</option>
              <option value="shopping">Shopping</option>
              <option value="wellness">Wellness</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {selectedReward ? 'Update Reward' : 'Create Reward'}
          </button>
          {selectedReward && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setSelectedReward(null);
                setFormData({
                  title: '',
                  description: '',
                  points: '',
                  stock: '',
                  category: 'food'
                });
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="rewards-list">
        <h3>Existing Rewards</h3>
        <div className="rewards-grid">
          {rewards.map(reward => (
            <div key={reward.id} className="reward-card">
              <div className="reward-content">
                <h4>{reward.title}</h4>
                <p>{reward.description}</p>
                <div className="reward-meta">
                  <span>Points: {reward.points}</span>
                  <span>Stock: {reward.stock}</span>
                  <span>Category: {reward.category}</span>
                </div>
              </div>
              <div className="reward-actions">
                <button
                  onClick={() => handleEdit(reward)}
                  className="btn-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(reward.id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .reward-manager {
          padding: var(--spacing-6);
        }

        h2 {
          margin-bottom: var(--spacing-6);
          font-size: 1.875rem;
          font-weight: 700;
        }

        .reward-form {
          background-color: var(--color-white);
          padding: var(--spacing-6);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
          margin-bottom: var(--spacing-8);
        }

        .form-group {
          margin-bottom: var(--spacing-4);
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-4);
        }

        label {
          display: block;
          margin-bottom: var(--spacing-2);
          font-weight: 500;
        }

        input,
        textarea,
        select {
          width: 100%;
          padding: var(--spacing-3);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius);
          font-size: 1rem;
        }

        textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: var(--spacing-4);
          margin-top: var(--spacing-6);
        }

        .rewards-list {
          margin-top: var(--spacing-8);
        }

        h3 {
          margin-bottom: var(--spacing-4);
          font-size: 1.5rem;
          font-weight: 600;
        }

        .rewards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-4);
        }

        .reward-card {
          background-color: var(--color-white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }

        .reward-content {
          padding: var(--spacing-4);
        }

        h4 {
          margin-bottom: var(--spacing-2);
          font-size: 1.25rem;
          font-weight: 600;
        }

        .reward-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-3);
          margin-top: var(--spacing-3);
          font-size: 0.875rem;
          color: var(--color-text-light);
        }

        .reward-actions {
          display: flex;
          gap: var(--spacing-2);
          padding: var(--spacing-4);
          background-color: var(--color-background);
        }

        .btn-primary {
          background-color: var(--color-primary);
          color: var(--color-white);
          padding: var(--spacing-2) var(--spacing-4);
          border-radius: var(--border-radius);
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-primary:hover {
          background-color: var(--color-primary-dark);
        }

        .btn-secondary {
          background-color: var(--color-background);
          color: var(--color-text);
          padding: var(--spacing-2) var(--spacing-4);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-border);
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-secondary:hover {
          background-color: var(--color-background-dark);
        }

        .btn-danger {
          background-color: var(--color-danger);
          color: var(--color-white);
          padding: var(--spacing-2) var(--spacing-4);
          border-radius: var(--border-radius);
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-danger:hover {
          background-color: var(--color-danger-dark);
        }
      `}</style>
    </div>
  );
};

export default RewardManager;
