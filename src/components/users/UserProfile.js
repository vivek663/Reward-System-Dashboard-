import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';

const UserProfile = () => {
  const user = useSelector(selectCurrentUser);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Username</span>
              <span className="value">{user.username}</span>
            </div>
            <div className="info-item">
              <span className="label">Role</span>
              <span className="value">{user.role}</span>
            </div>
            <div className="info-item">
              <span className="label">Points Balance</span>
              <span className="value">{user.points}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .user-profile {
          max-width: 800px;
          margin: 0 auto;
          padding: var(--spacing-6);
        }

        .profile-header {
          margin-bottom: var(--spacing-6);
        }

        h1 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-text);
        }

        .profile-content {
          background-color: var(--color-white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
        }

        .profile-section {
          padding: var(--spacing-6);
        }

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: var(--spacing-4);
          color: var(--color-text);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-4);
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-light);
        }

        .value {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-text);
        }

        @media (max-width: 640px) {
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
