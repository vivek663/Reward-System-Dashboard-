import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  updateUserPoints,
  fetchUserById,
  updateUserStreak,
  fetchUserTransactions
} from './usersAPI';

const initialState = {
  users: [],
  selectedUser: null,
  transactions: [],
  status: 'idle',
  error: null,
  filters: {
    role: 'all',
    searchQuery: ''
  }
};

// Async thunks
export const fetchUsersAdmin = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await fetchUsers();
    return response;
  }
);

export const createUserAdmin = createAsyncThunk(
  'users/createUser',
  async (userData) => {
    const response = await createUser(userData);
    return response;
  }
);

export const updateUserAdmin = createAsyncThunk(
  'users/updateUser',
  async ({ userId, updateData }) => {
    const response = await updateUser(userId, updateData);
    return response;
  }
);

export const deleteUserAdmin = createAsyncThunk(
  'users/deleteUser',
  async (userId) => {
    await deleteUser(userId);
    return userId;
  }
);

export const searchUsersAdmin = createAsyncThunk(
  'users/searchUsers',
  async (query) => {
    const response = await searchUsers(query);
    return response;
  }
);

export const updateUserPointsAdmin = createAsyncThunk(
  'users/updatePoints',
  async ({ userId, points }) => {
    const response = await updateUserPoints(userId, points);
    return response;
  }
);

export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async (userId) => {
    const response = await fetchUserById(userId);
    return response;
  }
);

export const updateStreak = createAsyncThunk(
  'users/updateStreak',
  async ({ userId, streak }) => {
    const response = await updateUserStreak(userId, streak);
    return response;
  }
);

export const getUserTransactions = createAsyncThunk(
  'users/getTransactions',
  async (userId) => {
    const response = await fetchUserTransactions(userId);
    return response;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFiltersAdmin: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsersAdmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsersAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsersAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create user
      .addCase(createUserAdmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUserAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.push(action.payload);
      })
      .addCase(createUserAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Update user
      .addCase(updateUserAdmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Delete user
      .addCase(deleteUserAdmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUserAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUserAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Search users
      .addCase(searchUsersAdmin.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      // Update user points
      .addCase(updateUserPointsAdmin.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Update Streak
      .addCase(updateStreak.fulfilled, (state, action) => {
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      // Get Transactions
      .addCase(getUserTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
      });
  }
});

// Selectors
export const selectAllUsers = (state) => {
  const { role, searchQuery } = state.users?.filters || { role: 'all', searchQuery: '' };
  const users = state.users?.users || [];
  
  return users.filter(user => {
    const roleMatch = role === 'all' || user.role === role;
    const searchMatch = !searchQuery || 
      user.username.toLowerCase().includes(searchQuery.toLowerCase());
    return roleMatch && searchMatch;
  });
};

export const selectUserById = (state, userId) => {
  if (!state.users) return null;
  return state.users.users.find(user => user.id === userId) || state.users.selectedUser;
};

export const selectUserStatus = (state) => state.users?.status || 'idle';
export const selectUserError = (state) => state.users?.error || null;
export const selectTransactions = (state) => state.users?.transactions || [];

export const { setFiltersAdmin, clearError } = usersSlice.actions;

export default usersSlice.reducer;
