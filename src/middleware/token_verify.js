import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
dotenv.config({ path: ['../../.env', '../.env'] })
const secret = process.env.SECRET;

// Middleware for JWT validation
export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.account = decoded;
    next();
  });
};