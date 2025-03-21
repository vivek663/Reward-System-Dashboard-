import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectAllUsers, 
  createUserAdmin, 
  updateUserAdmin, 
  deleteUserAdmin,
  searchUsersAdmin 
} from '../users/usersSlice';
import './UserManagement.css';

const UserManagement = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    points: 0,
  });

  useEffect(() => {
    if (searchTerm) {
      dispatch(searchUsersAdmin(searchTerm));
    }
  }, [dispatch, searchTerm]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await dispatch(updateUserAdmin({ 
          id: editingUser.id, 
          updates: formData 
        })).unwrap();
        setEditingUser(null);
      } else {
        await dispatch(createUserAdmin(formData)).unwrap();
      }
      setFormData({ username: '', email: '', role: 'user', points: 0 });
    } catch (error) {
      console.error('Failed to save user:', error);
      // You could add error handling UI here
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      points: user.points,
    });
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUserAdmin(userId)).unwrap();
      } catch (error) {
        console.error('Failed to delete user:', error);
        // You could add error handling UI here
      }
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ username: '', email: '', role: 'user', points: 0 });
  };

  return (
    <div className="user-management">
      <header className="user-management-header">
        <h1>User Management</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <div className="user-management-content">
        <div className="user-form-section">
          <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="points">Points</label>
              <input
                type="number"
                id="points"
                name="points"
                value={formData.points}
                onChange={handleInputChange}
                min="0"
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingUser ? 'Update User' : 'Add User'}
              </button>
              {editingUser && (
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="users-list-section">
          <h2>Users List</h2>
          <div className="users-grid">
            {filteredUsers.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-card-header">
                  <div className="user-avatar">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h3>{user.username}</h3>
                    <span className="user-email">{user.email}</span>
                  </div>
                  <span className={`badge ${user.role === 'admin' ? 'badge-success' : 'badge-info'}`}>
                    {user.role}
                  </span>
                </div>
                <div className="user-card-content">
                  <div className="user-points">
                    <span className="points-label">Points</span>
                    <span className="points-value">{user.points?.toLocaleString() || 0}</span>
                  </div>
                </div>
                <div className="user-card-actions">
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
