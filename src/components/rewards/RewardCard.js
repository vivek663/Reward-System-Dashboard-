import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserById } from '../../features/users/usersSlice';
import { claimRewardAsync } from '../../features/rewards/rewardsSlice';
import './RewardCard.css';

const RewardCard = ({ reward }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => selectUserById(state, state.auth.userId));
  const available = reward.stock - reward.claimed;
  const canAfford = user?.points >= reward.points;

  const handleClaim = () => {
    if (canAfford && available > 0) {
      dispatch(claimRewardAsync(reward.id));
    }
  };

  return (
    <div className="reward-card">
      <div className="reward-content">
        <div className="reward-header">
          <h3 className="reward-title">{reward.title}</h3>
          <span className="reward-points">{reward.points.toLocaleString()} pts</span>
        </div>
        
        <p className="reward-description">{reward.description}</p>
        
        <div className="reward-meta">
          <div className="stock-info">
            <span className="label">Available:</span>
            <span className={`value ${available < 10 ? 'low-stock' : ''}`}>
              {available} left
            </span>
          </div>
          
          {reward.expiresAt && (
            <div className="expiry-info">
              <span className="label">Expires:</span>
              <span className="value">
                {new Date(reward.expiresAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="reward-footer">
        <div className="claim-status">
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${(reward.claimed / reward.stock) * 100}%` }}
            />
          </div>
          <span className="claimed-count">
            {reward.claimed} claimed
          </span>
        </div>

        <button
          className={`claim-button ${!canAfford || available === 0 ? 'disabled' : ''}`}
          onClick={handleClaim}
          disabled={!canAfford || available === 0}
        >
          {available === 0 ? 'Out of Stock' : 
           !canAfford ? 'Not Enough Points' : 
           'Claim Reward'}
        </button>
      </div>
    </div>
  );
};

RewardCard.propTypes = {
  reward: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    claimed: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    expiresAt: PropTypes.string
  }).isRequired
};

export default RewardCard;
