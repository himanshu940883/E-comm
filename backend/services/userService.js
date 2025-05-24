const db = require('../config/db'); 

exports.register = async (user_id, password, role = 'user') => {
  if (!user_id || !password) return { error: 'user_id and password required' };
  const existingUser = await db('users').where({ user_id }).first();
  if (existingUser) return { error: 'User already exists' };
  await db('users').insert({ user_id, password, role });
  return { message: 'User registered', user_id, role };
};

exports.login = async (user_id, password) => {
  const user = await db('users')
    .where({ user_id, password })
    .first();

  if (!user) return { error: 'Invalid credentials' };
  return { message: 'Login successful', user_id: user.user_id, role: user.role, };
};
