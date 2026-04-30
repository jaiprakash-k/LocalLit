import dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
  expiresIn: process.env.JWT_EXPIRATION || '7d',
  algorithm: 'HS256'
};
