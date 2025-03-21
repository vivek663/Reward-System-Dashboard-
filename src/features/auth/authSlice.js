import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock user data for development
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    points: 5000,
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    username: 'user',
    password: 'user123',
    points: 1000,
    role: 'user',
    createdAt: '2024-02-01T00:00:00.000Z',
  }
];

// Simulated API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication API
const mockAuthAPI = async (credentials) => {
  await delay(800);
  const user = mockUsers.find(u => 
    u.username === credentials.username && 
    u.password === credentials.password
  );
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await mockAuthAPI(credentials);
      // Store token in localStorage (in a real app, this would be a JWT)
      localStorage.setItem('token', 'mock-jwt-token');
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check',
  async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null; // Return null instead of throwing error
    }
    
    // In a real app, we would validate the token with the backend
    // For now, just return the mock user
    await delay(300);
    const user = mockUsers[1]; // Default to regular user
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
);

// Initial state
const initialState = {
  user: null,
  status: 'idle',
  error: null,
  pointsHistory: [],
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    updatePoints: (state, action) => {
      const { points, type, description } = action.payload;
      if (state.user) {
        state.user.points += points;
        state.pointsHistory.unshift({
          id: Date.now(),
          points,
          type,
          description,
          date: new Date().toISOString(),
        });
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Check auth
      .addCase(checkAuth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload; // This might be null, which is fine
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Actions
export const { logout, updatePoints, clearError } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectUserPoints = (state) => state.auth.user?.points || 0;
export const selectPointsHistory = (state) => state.auth.pointsHistory;

export default authSlice.reducer;
