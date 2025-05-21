const { users } = require('../models/mockDB');

const authenticate = (req, res, next) => {
  const user = users.find(u => u.user_id === req.headers.user_id);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
};

module.exports = authenticate;
