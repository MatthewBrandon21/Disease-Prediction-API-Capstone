import jwt from 'jsonwebtoken';

export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    if (decoded.isactive == 0) {
      return res.sendStatus(403);
    }
    if (decoded.role.includes('user')) {
      return res.sendStatus(403);
    }
    req.email = decoded.email;
    next();
  });
};
