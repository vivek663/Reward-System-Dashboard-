import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API call - replace with actual API
const mockActivities = [
  {
    id: 1,
    title: 'Complete Profile',
    description: 'Fill out all profile information',
    points: 50,
    status: 'completed',
    completedAt: '2025-03-21T10:30:00Z'
  },
  {
    id: 2,
    title: 'Daily Login',
    description: 'Login to the platform',
    points: 10,
    status: 'completed',
    completedAt: '2025-03-21T09:00:00Z'
  },
  {
    id: 3,
    title: 'Share Achievement',
    description: 'Share your achievement on social media',
    points: 30,
    status: 'pending'
  },
  {
    id: 4,
    title: 'Complete Tutorial',
    description: 'Complete the platform tutorial',
    points: 100,
    status: 'pending'
  },
  {
    id: 5,
    title: 'First Reward Claim',
    description: 'Claim your first reward from the store',
    points: 75,
    status: 'completed',
    completedAt: '2025-03-20T15:45:00Z'
  },
  {
    id: 6,
    title: 'Refer a Friend',
    description: 'Invite a friend to join the platform',
    points: 200,
    status: 'pending'
  }
];

// Async thunk for fetching activities
export const fetchActivities = createAsyncThunk(
  'activities/fetchActivities',
  async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockActivities);
      }, 1000);
    });
  }
);

// Async thunk for completing an activity
export const completeActivity = createAsyncThunk(
  'activities/completeActivity',
  async (activityId) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: activityId,
          completedAt: new Date().toISOString()
        });
      }, 500);
    });
  }
);

const activitiesSlice = createSlice({
  name: 'activities',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(completeActivity.fulfilled, (state, action) => {
        const activity = state.items.find(item => item.id === action.payload.id);
        if (activity) {
          activity.status = 'completed';
          activity.completedAt = action.payload.completedAt;
        }
      });
  }
});

export default activitiesSlice.reducer;

// Selectors
export const selectAllActivities = state => state.activities.items;
export const selectActivityById = (state, activityId) => 
  state.activities.items.find(activity => activity.id === activityId);
export const selectActivitiesStatus = state => state.activities.status;
export const selectActivitiesError = state => state.activities.error;
export const selectCompletedActivities = state => 
  state.activities.items.filter(activity => activity.status === 'completed');
export const selectPendingActivities = state => 
  state.activities.items.filter(activity => activity.status === 'pending');
