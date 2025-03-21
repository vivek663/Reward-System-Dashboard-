// Mock data for rewards
let rewards = [
  {
    id: '1',
    title: 'Coffee Voucher',
    description: 'Free coffee at any local coffee shop',
    points: 100,
    stock: 50,
    category: 'food',
    createdAt: '2024-03-21T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Movie Tickets',
    description: 'Two tickets to any movie',
    points: 300,
    stock: 20,
    category: 'entertainment',
    createdAt: '2024-03-21T00:00:00.000Z'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all rewards
 * @returns {Promise<Array>} List of rewards
 */
export const fetchRewards = async () => {
  await delay(500);
  return [...rewards];
};

/**
 * Fetch reward by ID
 * @param {string} rewardId - Reward ID
 * @returns {Promise<Object>} Reward object
 */
export const fetchRewardById = async (rewardId) => {
  await delay(500);
  const reward = rewards.find(r => r.id === rewardId);
  if (!reward) throw new Error('Reward not found');
  return { ...reward };
};

/**
 * Create a new reward
 * @param {Object} rewardData - Reward data
 * @returns {Promise<Object>} Created reward object
 */
export const createReward = async (rewardData) => {
  await delay(500);
  const newReward = {
    id: String(rewards.length + 1),
    ...rewardData,
    createdAt: new Date().toISOString()
  };
  rewards.push(newReward);
  return { ...newReward };
};

/**
 * Update reward
 * @param {string} rewardId - Reward ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated reward object
 */
export const updateReward = async (rewardId, updateData) => {
  await delay(500);
  const index = rewards.findIndex(r => r.id === rewardId);
  if (index === -1) throw new Error('Reward not found');
  
  rewards[index] = {
    ...rewards[index],
    ...updateData
  };
  return { ...rewards[index] };
};

/**
 * Delete reward
 * @param {string} rewardId - Reward ID
 * @returns {Promise<void>}
 */
export const deleteReward = async (rewardId) => {
  await delay(500);
  const index = rewards.findIndex(r => r.id === rewardId);
  if (index === -1) throw new Error('Reward not found');
  rewards = rewards.filter(r => r.id !== rewardId);
};

/**
 * Claim reward
 * @param {Object} params - Claim parameters
 * @param {string} params.rewardId - Reward ID
 * @param {string} params.userId - User ID
 * @returns {Promise<Object>} Updated reward object
 */
export const claimReward = async ({ rewardId, userId }) => {
  await delay(500);
  const index = rewards.findIndex(r => r.id === rewardId);
  if (index === -1) throw new Error('Reward not found');
  
  if (rewards[index].stock <= 0) {
    throw new Error('Reward out of stock');
  }
  
  rewards[index] = {
    ...rewards[index],
    stock: rewards[index].stock - 1
  };
  
  return { ...rewards[index] };
};
