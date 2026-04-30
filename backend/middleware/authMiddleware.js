import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig.js';

/**
 * Middleware to verify JWT Token
 * Adds user info to request object
 */
export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.userId = decoded.user_id;
    req.userEmail = decoded.email;
    next();
  });
};

/**
 * Middleware for optional token verification
 * Continues even if token is invalid
 */
export const optionalVerifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (token) {
    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (!err) {
        req.userId = decoded.user_id;
        req.userEmail = decoded.email;
      }
    });
  }

  next();
};

export default verifyToken;
