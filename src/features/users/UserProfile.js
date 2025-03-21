import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  selectUserById,
  selectUserStatus,
  selectUserError,
  selectTransactions,
  fetchUsersAdmin,
  getUserTransactions,
  updateStreak
} from './usersSlice';
import './UserProfile.css';

// Components
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import TransactionHistory from './TransactionHistory';
import UserStats from './UserStats';
import ActivityFeed from '../activities/ActivityFeed';

const UserProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  
  const user = useSelector(state => selectUserById(state, parseInt(userId)));
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);
  const transactions = useSelector(selectTransactions);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsersAdmin());
    }
    if (userId) {
      dispatch(getUserTransactions(userId));
      dispatch(updateStreak(userId));
    }
  }, [status, dispatch, userId]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'failed') {
    return <ErrorMessage message={error} />;
  }

  if (!user) {
    return <ErrorMessage message="User not found" />;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="user-info">
          <div className="user-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h2>{user.username}</h2>
            <p className="user-email">{user.email}</p>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
        <div className="user-points">
          <span className="points-label">Total Points</span>
          <span className="points-value">{user.points?.toLocaleString() || 0}</span>
        </div>
      </div>

      <div className="profile-content">
        <div className="main-section">
          <UserStats user={user} />
          <ActivityFeed userId={parseInt(userId)} />
        </div>
        <div className="side-section">
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
