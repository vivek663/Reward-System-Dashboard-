import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRewardsAsync, selectRewardsStatus, selectRewardsError } from './rewardsSlice';
import RewardList from '../../components/rewards/RewardList';
import './Rewards.css';

const Rewards = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectRewardsStatus);
  const error = useSelector(selectRewardsError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRewardsAsync());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div className="loading">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="rewards-container">
      <h1>Available Rewards</h1>
      <RewardList />
    </div>
  );
};

export default Rewards;
