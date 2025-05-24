const db = require('../config/db');

const authenticate = async (req, res, next) => {
  const user = await db('users').where({ user_id: req.headers.user_id }).first();
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
};

module.exports = authenticate;
