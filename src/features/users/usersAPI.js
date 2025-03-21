// Mock data for users
let users = [
  {
    id: '1',
    username: 'admin',
    role: 'admin',
    points: 1000,
    createdAt: '2024-03-21T00:00:00.000Z'
  },
  {
    id: '2',
    username: 'user1',
    role: 'user',
    points: 500,
    createdAt: '2024-03-21T00:00:00.000Z'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all users
 * @returns {Promise<Array>} List of users
 */
export const fetchUsers = async () => {
  await delay(500);
  return [...users];
};

/**
 * Fetch user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 */
export const fetchUserById = async (userId) => {
  await delay(500);
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  return { ...user };
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user object
 */
export const createUser = async (userData) => {
  await delay(500);
  const newUser = {
    id: String(users.length + 1),
    ...userData,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  return { ...newUser };
};

/**
 * Update user
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user object
 */
export const updateUser = async (userId, updateData) => {
  await delay(500);
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found');
  
  users[index] = {
    ...users[index],
    ...updateData
  };
  return { ...users[index] };
};

/**
 * Delete user
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  await delay(500);
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found');
  users = users.filter(u => u.id !== userId);
};

/**
 * Search users
 * @param {string} query - Search query
 * @returns {Promise<Array>} List of matching users
 */
export const searchUsers = async (query) => {
  await delay(500);
  const lowerQuery = query.toLowerCase();
  return users.filter(user => 
    user.username.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Update user points
 * @param {string} userId - User ID
 * @param {number} points - Points to add (or subtract if negative)
 * @returns {Promise<Object>} Updated user object
 */
export const updateUserPoints = async (userId, points) => {
  await delay(500);
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found');
  
  users[index] = {
    ...users[index],
    points: Math.max(0, users[index].points + points)
  };
  return { ...users[index] };
};

/**
 * Update user streak
 * @param {string} userId - User ID
 * @param {number} streak - New streak value
 * @returns {Promise<Object>} Updated user object
 */
export const updateUserStreak = async (userId, streak) => {
  await delay(500);
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found');
  
  users[index] = {
    ...users[index],
    streak
  };
  return { ...users[index] };
};

/**
 * Fetch user transactions
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of user transactions
 */
export const fetchUserTransactions = async (userId) => {
  await delay(500);
  // Mock transaction data
  return [
    {
      id: '1',
      userId,
      type: 'reward_claim',
      points: -100,
      description: 'Claimed Coffee Reward',
      timestamp: new Date().toISOString()
    }
  ];
};
