import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export default function middleware(req, res, next) {
  next()
  return;
  
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ status: 'error', message: 'Authorization header is missing' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ status: 'error', message: 'Authorization header is malformed' });
  }

  try {
    const token = parts[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    req.customerId = decoded.customerId;
    next();
  } catch (err) {
    console.log(err);
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ status: 'error', message: 'Your session has expired, please log in again.' });
    } else {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
  }
}
