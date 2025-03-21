import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRewardByIdAsync,
  claimRewardAsync,
  selectAllRewards,
  selectSelectedReward
} from '../../features/rewards/rewardsSlice';
import { selectCurrentUser } from '../../features/auth/authSlice';

const RewardDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rewards = useSelector(selectAllRewards);
  const selectedReward = useSelector(selectSelectedReward);
  const user = useSelector(selectCurrentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchRewardByIdAsync(id));
    }
  }, [dispatch, id]);

  const reward = selectedReward || rewards.find(r => r.id === parseInt(id));

  if (!reward) {
    return <div className="loading"></div>;
  }

  const stockLeft = reward.stock - reward.claimed;
  const canClaim = user?.points >= reward.points && stockLeft > 0;
  const expiryDate = new Date(reward.expiresAt).toLocaleDateString();

  const handleClaimReward = async () => {
    if (!canClaim) return;

    setIsLoading(true);
    setError(null);

    try {
      await dispatch(claimRewardAsync({ rewardId: reward.id, userId: user.id })).unwrap();
      navigate('/profile', { 
        state: { 
          message: 'Reward claimed successfully!',
          type: 'success'
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to claim reward. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reward-detail">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="image-section">
          <img 
            src={reward.image} 
            alt={reward.title}
            className="reward-image"
          />
          <div className="reward-category">
            {reward.category}
          </div>
        </div>

        {/* Content Section */}
        <div className="content-section">
          <h1 className="reward-title">{reward.title}</h1>
          <p className="reward-description">{reward.description}</p>

          <div className="reward-stats">
            <div className="stat-card">
              <div className="stat-value text-primary">{reward.points}</div>
              <div className="stat-label">Points Required</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-success">{stockLeft}</div>
              <div className="stat-label">Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-warning">{reward.claimed}</div>
              <div className="stat-label">Claimed</div>
            </div>
          </div>

          <div className="reward-info">
            <div className="info-item">
              <span className="info-label">Expiry Date</span>
              <span className="info-value">{expiryDate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Your Points</span>
              <span className="info-value text-primary">{user?.points || 0}</span>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="action-section">
            <button
              className={`btn ${canClaim ? 'btn-primary' : 'btn-disabled'}`}
              onClick={handleClaimReward}
              disabled={!canClaim || isLoading}
            >
              {isLoading ? 'Processing...' : 
               !canClaim && stockLeft === 0 ? 'Out of Stock' :
               !canClaim ? `Need ${reward.points - (user?.points || 0)} more points` :
               'Claim Reward'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .reward-detail {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: var(--spacing-6);
        }

        .image-section {
          position: relative;
        }

        .reward-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: var(--border-radius);
        }

        .reward-category {
          position: absolute;
          top: var(--spacing-4);
          right: var(--spacing-4);
          background-color: var(--color-white);
          padding: var(--spacing-2) var(--spacing-4);
          border-radius: var(--border-radius);
          font-weight: 500;
          text-transform: capitalize;
        }

        .content-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-6);
        }

        .reward-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-text);
        }

        .reward-description {
          font-size: 1.125rem;
          color: var(--color-text-light);
          line-height: 1.6;
        }

        .reward-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-4);
        }

        .stat-card {
          background-color: var(--color-white);
          padding: var(--spacing-4);
          border-radius: var(--border-radius);
          text-align: center;
          box-shadow: var(--shadow-sm);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--spacing-2);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--color-text-light);
        }

        .reward-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
          padding: var(--spacing-4);
          background-color: var(--color-secondary-light);
          border-radius: var(--border-radius);
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .info-label {
          font-weight: 500;
          color: var(--color-text-light);
        }

        .info-value {
          font-weight: 600;
        }

        .error-message {
          padding: var(--spacing-4);
          background-color: var(--color-danger-light);
          color: var(--color-danger);
          border-radius: var(--border-radius);
          font-weight: 500;
        }

        .action-section {
          margin-top: var(--spacing-4);
        }

        @media (max-width: 768px) {
          .reward-image {
            height: 300px;
          }

          .reward-title {
            font-size: 1.5rem;
          }

          .reward-description {
            font-size: 1rem;
          }

          .stat-value {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RewardDetail;
