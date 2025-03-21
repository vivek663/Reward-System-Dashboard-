import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchRewards,
  fetchRewardById,
  claimReward,
  createReward,
  updateReward,
  deleteReward
} from './rewardsAPI';

const initialState = {
  rewards: [],
  selectedReward: null,
  status: 'idle',
  error: null,
  filters: {
    category: 'all',
    minPoints: null,
    maxPoints: null,
    availability: 'all', 
    searchQuery: '',
  },
  sorting: {
    field: 'points',
    order: 'asc'
  }
};

export const fetchRewardsAsync = createAsyncThunk(
  'rewards/fetchRewards',
  async () => {
    const response = await fetchRewards();
    return response;
  }
);

export const fetchRewardByIdAsync = createAsyncThunk(
  'rewards/fetchRewardById',
  async (rewardId) => {
    const response = await fetchRewardById(rewardId);
    return response;
  }
);

export const claimRewardAsync = createAsyncThunk(
  'rewards/claimReward',
  async ({ rewardId, userId }) => {
    const response = await claimReward({ rewardId, userId });
    return response;
  }
);

export const createRewardAsync = createAsyncThunk(
  'rewards/createReward',
  async (rewardData) => {
    const response = await createReward(rewardData);
    return response;
  }
);

export const updateRewardAsync = createAsyncThunk(
  'rewards/updateReward',
  async ({ rewardId, updateData }) => {
    const response = await updateReward(rewardId, updateData);
    return response;
  }
);

export const deleteRewardAsync = createAsyncThunk(
  'rewards/deleteReward',
  async (rewardId) => {
    await deleteReward(rewardId);
    return rewardId;
  }
);

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    clearSelectedReward: (state) => {
      state.selectedReward = null;
    },
    setSelectedReward: (state, action) => {
      state.selectedReward = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSorting: (state, action) => {
      state.sorting = { ...state.sorting, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Rewards
      .addCase(fetchRewardsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRewardsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rewards = action.payload;
      })
      .addCase(fetchRewardsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch Reward by ID
      .addCase(fetchRewardByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRewardByIdAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedReward = action.payload;
      })
      .addCase(fetchRewardByIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Claim Reward
      .addCase(claimRewardAsync.fulfilled, (state, action) => {
        const updatedReward = action.payload;
        const index = state.rewards.findIndex(r => r.id === updatedReward.id);
        if (index !== -1) {
          state.rewards[index] = updatedReward;
        }
      })
      // Create Reward
      .addCase(createRewardAsync.fulfilled, (state, action) => {
        state.rewards.push(action.payload);
      })
      // Update Reward
      .addCase(updateRewardAsync.fulfilled, (state, action) => {
        const updatedReward = action.payload;
        const index = state.rewards.findIndex(r => r.id === updatedReward.id);
        if (index !== -1) {
          state.rewards[index] = updatedReward;
        }
      })
      // Delete Reward
      .addCase(deleteRewardAsync.fulfilled, (state, action) => {
        state.rewards = state.rewards.filter(reward => reward.id !== action.payload);
      });
  }
});

export const { 
  clearSelectedReward, 
  setSelectedReward, 
  setFilters, 
  setSorting, 
  resetFilters,
  clearError 
} = rewardsSlice.actions;

// Selectors
export const selectAllRewards = (state) => {
  const { category, minPoints, maxPoints, availability, searchQuery } = state.rewards.filters;
  const { field, order } = state.rewards.sorting;
  
  let filteredRewards = state.rewards.rewards;

  // Apply category filter
  if (category !== 'all') {
    filteredRewards = filteredRewards.filter(reward => reward.category === category);
  }

  // Apply points filter
  if (minPoints !== null) {
    filteredRewards = filteredRewards.filter(reward => reward.points >= minPoints);
  }

  if (maxPoints !== null) {
    filteredRewards = filteredRewards.filter(reward => reward.points <= maxPoints);
  }

  // Apply availability filter
  if (availability !== 'all') {
    filteredRewards = filteredRewards.filter(reward => {
      const stockLeft = reward.stock - reward.claimed;
      return availability === 'inStock' ? stockLeft > 0 : stockLeft === 0;
    });
  }

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredRewards = filteredRewards.filter(reward =>
      reward.title.toLowerCase().includes(query) ||
      reward.description.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  return [...filteredRewards].sort((a, b) => {
    let compareValue = 0;
    switch (field) {
      case 'points':
        compareValue = a.points - b.points;
        break;
      case 'stock':
        compareValue = (a.stock - a.claimed) - (b.stock - b.claimed);
        break;
      case 'popularity':
        compareValue = b.claimed - a.claimed;
        break;
      case 'createdAt':
        compareValue = new Date(b.createdAt) - new Date(a.createdAt);
        break;
      default:
        compareValue = 0;
    }
    return order === 'asc' ? compareValue : -compareValue;
  });
};
export const selectSelectedReward = (state) => state.rewards.selectedReward;
export const selectRewardsStatus = (state) => state.rewards.status;
export const selectRewardsError = (state) => state.rewards.error;
export const selectRewardsFilters = (state) => state.rewards.filters;
export const selectRewardsSorting = (state) => state.rewards.sorting;
export const selectRewardById = (state, rewardId) => 
  state.rewards.rewards.find(reward => reward.id === rewardId);
export const selectClaimStatus = (state) => state.rewards.claimStatus;
export const selectClaimError = (state) => state.rewards.claimError;

export default rewardsSlice.reducer;
