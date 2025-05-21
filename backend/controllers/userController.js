const service = require('../services/userService');

exports.register = (req, res) => {
  const result = service.register(req.body.user_id, req.body.password);
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result);
};

exports.login = (req, res) => {
  const result = service.login(req.body.user_id, req.body.password);
  if (result.error) return res.status(401).json(result);
  res.json(result);
};
