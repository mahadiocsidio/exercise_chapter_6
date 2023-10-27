const jwt = require('jsonwebtoken');
const tokenVerify = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized', data: null });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Forbidden', data: null });

    req.user = user;
    next();
  });
};

module.exports = tokenVerify;