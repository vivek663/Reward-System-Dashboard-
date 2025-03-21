import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllRewards } from '../rewards/rewardsSlice';
import { addReward, updateReward, removeReward } from '../rewards/rewardsSlice';

const RewardManagement = () => {
  const dispatch = useDispatch();
  const rewards = useSelector(selectAllRewards);
  const [editingReward, setEditingReward] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points: 0,
    category: 'gift-cards',
    image: '',
    stock: 0,
    expiryDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['points', 'stock'].includes(name) ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingReward) {
      dispatch(updateReward({ id: editingReward.id, ...formData }));
      setEditingReward(null);
    } else {
      dispatch(addReward({
        id: Date.now().toString(),
        ...formData,
        timesRedeemed: 0,
      }));
    }
    setFormData({
      name: '',
      description: '',
      points: 0,
      category: 'gift-cards',
      image: '',
      stock: 0,
      expiryDate: '',
    });
  };

  const handleEdit = (reward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name,
      description: reward.description,
      points: reward.points,
      category: reward.category,
      image: reward.image,
      stock: reward.stock,
      expiryDate: reward.expiryDate || '',
    });
  };

  const handleDelete = (rewardId) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      dispatch(removeReward(rewardId));
    }
  };

  return (
    <div className="admin-section">
      <h2>Reward Management</h2>
      
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
          <label htmlFor="points">Points Required</label>
          <input
            type="number"
            id="points"
            name="points"
            value={formData.points}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="gift-cards">Gift Cards</option>
            <option value="merchandise">Merchandise</option>
            <option value="experiences">Experiences</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            required
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
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="button button-primary">
          {editingReward ? 'Update Reward' : 'Add Reward'}
        </button>
        {editingReward && (
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setEditingReward(null);
              setFormData({
                name: '',
                description: '',
                points: 0,
                category: 'gift-cards',
                image: '',
                stock: 0,
                expiryDate: '',
              });
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="rewards-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Points</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Times Redeemed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map(reward => (
              <tr key={reward.id}>
                <td>{reward.name}</td>
                <td>{reward.points}</td>
                <td>{reward.category}</td>
                <td>{reward.stock}</td>
                <td>{reward.timesRedeemed || 0}</td>
                <td>
                  <button
                    className="button button-small"
                    onClick={() => handleEdit(reward)}
                  >
                    Edit
                  </button>
                  <button
                    className="button button-small button-danger"
                    onClick={() => handleDelete(reward.id)}
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

export default RewardManagement;
