import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';
import { fetchRewardsAsync, selectAllRewards, selectRewardsStatus } from '../features/rewards/rewardsSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const rewards = useSelector(selectAllRewards);
  const rewardsStatus = useSelector(selectRewardsStatus);

  useEffect(() => {
    if (rewardsStatus === 'idle') {
      dispatch(fetchRewardsAsync());
    }
  }, [rewardsStatus, dispatch]);

  if (!user) return null;

  return (
    <div className="main-content">
      {/* User Welcome Section */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '270px' }}>
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user.username}!</h1>
          <p className="text-gray-600">You have <span className="font-semibold text-primary">{user.points} points</span> available</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Available Rewards</h3>
          <p className="text-3xl font-bold text-primary">{rewards.length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Rewards Claimed</h3>
          <p className="text-3xl font-bold text-success">
            {rewards.reduce((acc, reward) => acc + (reward.claimed || 0), 0)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Points Needed</h3>
          <p className="text-3xl font-bold text-warning">
            {Math.min(...rewards.map(reward => reward.points)) || 0}
          </p>
        </div>
      </div>

      {/* Featured Rewards */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Featured Rewards</h2>
          <Link to="/rewards" className="btn btn-secondary">View All</Link>
        </div>

        {rewardsStatus === 'loading' ? (
          <div className="loading"></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.slice(0, 3).map(reward => (
              <div key={reward.id} className="card">
                <img 
                  src={reward.image} 
                  alt={reward.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{reward.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{reward.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">{reward.points} points</span>
                    <Link 
                      to={`/rewards/${reward.id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="card mt-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {rewards.filter(r => r.claimed > 0).slice(0, 5).map(reward => (
            <div key={reward.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <img 
                  src={reward.image} 
                  alt={reward.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold">{reward.title}</h4>
                  <p className="text-sm text-gray-600">
                    {reward.claimed} claimed • {reward.stock - reward.claimed} remaining
                  </p>
                </div>
              </div>
              <span className="text-primary font-semibold">{reward.points} points</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
