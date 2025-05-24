const service = require('../services/userService');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { user_id, password, role } = req.body;
  const result = await service.register(user_id, password, role || 'user');
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result);
};

exports.login = async (req, res) => {
  const result = await service.login(req.body.user_id, req.body.password);
  if (result.error) return res.status(401).json(result);
  res.json(result);
};
