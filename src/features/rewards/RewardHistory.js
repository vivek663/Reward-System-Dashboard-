import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import { fetchUserRewards, selectUserRewardsStatus, selectUserRewardsError } from './rewardsSlice';
import './RewardHistory.css';

const RewardHistory = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const userRewards = useSelector(state => state.rewards.userRewards);
  const status = useSelector(selectUserRewardsStatus);
  const error = useSelector(selectUserRewardsError);

  useEffect(() => {
    if (currentUser?.id && status === 'idle') {
      dispatch(fetchUserRewards(currentUser.id));
    }
  }, [dispatch, currentUser?.id, status]);

  if (!currentUser) {
    return (
      <div className="reward-history">
        <div className="error-message">
          Please log in to view your reward history
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="reward-history">
        <div className="loading-spinner">Loading reward history...</div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="reward-history">
        <div className="error-message">
          {error}
          <button 
            className="retry-button"
            onClick={() => dispatch(fetchUserRewards(currentUser.id))}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'completed':
        return 'status-completed';
      case 'failed':
        return 'status-failed';
      default:
        return '';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="reward-history">
      <div className="history-header">
        <h2>Reward History</h2>
        <p>Track the status of your claimed rewards</p>
        <div className="user-points">
          <span className="points-label">Available Points:</span>
          <span className="points-value">{currentUser.points}</span>
        </div>
      </div>

      {userRewards.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎁</div>
          <h3>No Rewards Yet</h3>
          <p>Start claiming rewards to see your history here!</p>
        </div>
      ) : (
        <div className="history-list">
          {userRewards.map(reward => (
            <div key={reward.id} className="history-item">
              <div className="reward-icon">{reward.image}</div>
              
              <div className="reward-info">
                <h3>{reward.title}</h3>
                <p className="reward-points">{reward.points} Points</p>
                <div className="claim-date">
                  Claimed on {formatDate(reward.claimedAt)}
                </div>
              </div>

              <div className="reward-status">
                <div className={`status-badge ${getStatusBadgeClass(reward.status)}`}>
                  {reward.status}
                </div>
                {reward.status === 'failed' && reward.errorMessage && (
                  <div className="error-tooltip">
                    <span className="error-icon">ℹ️</span>
                    <div className="tooltip-content">
                      {reward.errorMessage}
                    </div>
                  </div>
                )}
              </div>

              {reward.deliveryDetails && (
                <div className="delivery-info">
                  <div className="delivery-header">
                    <span className="delivery-icon">📦</span>
                    Delivery Details
                  </div>
                  <div className="delivery-content">
                    {reward.deliveryDetails.type === 'digital' ? (
                      <>
                        <p>Check your email at {reward.deliveryDetails.email}</p>
                        {reward.deliveryDetails.code && (
                          <div className="redemption-code">
                            Code: <span>{reward.deliveryDetails.code}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p>Tracking Number: {reward.deliveryDetails.trackingNumber}</p>
                        <p>Carrier: {reward.deliveryDetails.carrier}</p>
                        <p>Estimated Delivery: {formatDate(reward.deliveryDetails.estimatedDelivery)}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RewardHistory;
