import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import {
  selectRewardById,
  selectRewardsStatus,
  selectRewardsError,
  selectClaimStatus,
  selectClaimError,
  fetchRewardByIdAsync,
  claimRewardAsync,
  clearError
} from './rewardsSlice';
import './RewardDetail.css';

const RewardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const currentUser = useSelector(selectCurrentUser);
  const reward = useSelector(state => selectRewardById(state, parseInt(id)));
  const status = useSelector(selectRewardsStatus);
  const error = useSelector(selectRewardsError);
  const claimStatus = useSelector(selectClaimStatus);
  const claimError = useSelector(selectClaimError);
  
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (!reward && status === 'idle') {
      dispatch(fetchRewardByIdAsync(parseInt(id)));
    }
  }, [reward, status, dispatch, id]);

  useEffect(() => {
    if (claimStatus === 'succeeded' && isClaiming) {
      setIsClaiming(false);
      // Navigate to history page after successful claim
      navigate('/history');
    }
  }, [claimStatus, isClaiming, navigate]);

  const handleClaimReward = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.points < reward.points) {
      return;
    }

    if (reward.stock <= reward.claimed) {
      return;
    }

    setIsClaiming(true);
    dispatch(claimRewardAsync({ rewardId: reward.id, userId: currentUser.id }));
  };

  if (status === 'loading' || !reward) {
    return (
      <div className="reward-detail">
        <div className="loading-spinner">Loading reward details...</div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="reward-detail">
        <div className="error-message">
          {error}
          <button 
            className="retry-button"
            onClick={() => {
              dispatch(clearError());
              dispatch(fetchRewardByIdAsync(parseInt(id)));
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const available = reward.stock - reward.claimed;
  const canAfford = currentUser?.points >= reward.points;

  return (
    <div className="reward-detail">
      <div className="reward-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back to Rewards
        </button>
        {currentUser && (
          <div className="user-points">
            <span className="points-icon">💎</span>
            <span className="points-value">{currentUser.points}</span>
            <span className="points-label">Points Available</span>
          </div>
        )}
      </div>

      {claimError && (
        <div className="error-banner">
          {claimError}
          <button className="close-button" onClick={() => dispatch(clearError())}>
            ✕
          </button>
        </div>
      )}

      <div className="reward-content">
        <div className="reward-image">
          {reward.image || '🎁'}
        </div>

        <div className="reward-info">
          <h1>{reward.title}</h1>
          <p className="description">{reward.description}</p>

          <div className="reward-stats">
            <div className="stat">
              <span className="stat-label">Points Required</span>
              <span className="stat-value">
                <span className="points-icon">💎</span>
                {reward.points}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Available</span>
              <span className="stat-value">{available} left</span>
            </div>
            <div className="stat">
              <span className="stat-label">Category</span>
              <span className="stat-value">{reward.category}</span>
            </div>
          </div>

          <button
            className={`claim-button ${
              isClaiming ? 'loading' :
              !currentUser ? 'disabled' :
              !canAfford ? 'insufficient' :
              available <= 0 ? 'out-of-stock' : ''
            }`}
            onClick={handleClaimReward}
            disabled={
              isClaiming ||
              !currentUser ||
              !canAfford ||
              available <= 0
            }
          >
            {isClaiming ? 'Claiming...' :
             !currentUser ? 'Login to Claim' :
             !canAfford ? `Need ${reward.points - currentUser.points} more points` :
             available <= 0 ? 'Out of Stock' :
             'Claim Reward'}
          </button>

          {currentUser && !canAfford && (
            <div className="points-needed">
              <p>You need {reward.points - currentUser.points} more points to claim this reward</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardDetail;
