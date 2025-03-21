import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllRewards, addToCart } from './rewardsSlice';

const RewardsList = () => {
  const dispatch = useDispatch();
  const rewards = useSelector(selectAllRewards);
  const [sortBy, setSortBy] = useState('points');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Debounced search function
  const debouncedSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredAndSortedRewards = rewards
    .filter((reward) => {
      if (filterCategory === 'all') return true;
      return reward.category === filterCategory;
    })
    .filter((reward) =>
      reward.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'points') return a.points - b.points;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleAddToCart = (reward) => {
    dispatch(addToCart(reward));
  };

  return (
    <div className="rewards-list">
      <h2>Available Rewards</h2>
      
      <div className="rewards-controls">
        <input
          type="text"
          placeholder="Search rewards..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="search-input"
        />
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="points">Sort by Points</option>
          <option value="name">Sort by Name</option>
        </select>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="gift-cards">Gift Cards</option>
          <option value="merchandise">Merchandise</option>
          <option value="experiences">Experiences</option>
        </select>
      </div>

      <div className="rewards-grid">
        {filteredAndSortedRewards.map((reward) => (
          <div key={reward.id} className="reward-card">
            <img src={reward.image} alt={reward.name} className="reward-image" />
            <div className="reward-info">
              <h3>{reward.name}</h3>
              <p>{reward.description}</p>
              <div className="reward-footer">
                <span className="reward-points">{reward.points} Points</span>
                <button
                  onClick={() => handleAddToCart(reward)}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsList;
