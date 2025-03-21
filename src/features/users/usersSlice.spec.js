import usersReducer, { addUser, removeUser, updateUser, setStatus, setError } from './usersSlice';

describe('usersSlice', () => {
  const initialState = {
    users: [],
    status: 'idle',
    error: null,
  };

  it('should handle initial state', () => {
    expect(usersReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle addUser', () => {
    const newUser = { id: 1, name: 'John Doe' };
    const expectedState = {
      users: [newUser],
      status: 'idle',
      error: null,
    };
    expect(usersReducer(initialState, addUser(newUser))).toEqual(expectedState);
  });

  it('should handle removeUser', () => {
    const initialStateWithUser = {
      users: [{ id: 1, name: 'John Doe' }],
      status: 'idle',
      error: null,
    };
    const expectedState = {
      users: [],
      status: 'idle',
      error: null,
    };
    expect(usersReducer(initialStateWithUser, removeUser(1))).toEqual(expectedState);
  });

  it('should handle updateUser', () => {
    const initialStateWithUser = {
      users: [{ id: 1, name: 'John Doe' }],
      status: 'idle',
      error: null,
    };
    const updatedUser = { id: 1, name: 'Jane Doe' };
    const expectedState = {
      users: [updatedUser],
      status: 'idle',
      error: null,
    };
    expect(usersReducer(initialStateWithUser, updateUser(updatedUser))).toEqual(expectedState);
  });

  it('should handle setStatus', () => {
    const expectedState = {
      users: [],
      status: 'loading',
      error: null,
    };
    expect(usersReducer(initialState, setStatus('loading'))).toEqual(expectedState);
  });

  it('should handle setError', () => {
    const expectedState = {
      users: [],
      status: 'idle',
      error: 'Error message',
    };
    expect(usersReducer(initialState, setError('Error message'))).toEqual(expectedState);
  });
});
