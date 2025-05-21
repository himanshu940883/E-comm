const { users } = require('../models/mockDB');

exports.register = (user_id, password) => {
  if (!user_id || !password) return { error: 'user_id and password required' };
  if (users.find(u => u.user_id === user_id)) return { error: 'User already exists' };
  users.push({ user_id, password });
  return { message: 'User registered' };
};

exports.login = (user_id, password) => {
  const user = users.find(u => u.user_id === user_id && u.password === password);
  return user ? { message: 'Login successful', user_id } : { error: 'Invalid credentials' };
};
