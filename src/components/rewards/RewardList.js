import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRewardsAsync, selectAllRewards, selectRewardsStatus } from '../../features/rewards/rewardsSlice';
import RewardCard from './RewardCard';

const RewardList = () => {
  const dispatch = useDispatch();
  const rewards = useSelector(selectAllRewards);
  const status = useSelector(selectRewardsStatus);
  const [sortBy, setSortBy] = useState('points');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRewardsAsync());
    }
  }, [status, dispatch]);

  const categories = ['all', ...new Set(rewards.map(reward => reward.category))];

  const sortedRewards = [...rewards].sort((a, b) => {
    switch (sortBy) {
      case 'points':
        return a.points - b.points;
      case 'stock':
        return (b.stock - b.claimed) - (a.stock - a.claimed);
      case 'popularity':
        return b.claimed - a.claimed;
      default:
        return 0;
    }
  });

  const filteredRewards = filterCategory === 'all'
    ? sortedRewards
    : sortedRewards.filter(reward => reward.category === filterCategory);

  if (status === 'loading') {
    return <div className="loading"></div>;
  }

  return (
    <div className="rewards-container">
      <div className="filters card mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="filter-group">
              <label htmlFor="category" className="filter-label">Category</label>
              <select
                id="category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort" className="filter-label">Sort by</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="points">Points: Low to High</option>
                <option value="stock">Stock Available</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>

          <div className="results-count">
            {filteredRewards.length} rewards found
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map(reward => (
          <RewardCard key={reward.id} reward={reward} />
        ))}
      </div>

      <style jsx>{`
        .rewards-container {
          min-height: 400px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .filter-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-light);
        }

        .filter-select {
          padding: var(--spacing-2) var(--spacing-4);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius);
          background-color: var(--color-white);
          color: var(--color-text);
          font-size: 0.875rem;
          min-width: 160px;
        }

        .filter-select:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px var(--color-primary-light);
        }

        .results-count {
          font-size: 0.875rem;
          color: var(--color-text-light);
        }

        @media (max-width: 640px) {
          .filters .flex {
            flex-direction: column;
            gap: var(--spacing-4);
          }

          .filter-group {
            width: 100%;
          }

          .filter-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default RewardList;
