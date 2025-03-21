import { configureStore } from '@reduxjs/toolkit';
import rewardsReducer from '../features/rewards/rewardsSlice';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';
import activitiesReducer from '../features/activities/activitiesSlice';

export const store = configureStore({
  reducer: {
    rewards: rewardsReducer,
    auth: authReducer,
    users: usersReducer,
    activities: activitiesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'rewards/claimReward/fulfilled',
          'rewards/fetchUserRewards/fulfilled',
          'users/updateStreak/fulfilled',
          'users/getTransactions/fulfilled'
        ],
      },
    }),
});
