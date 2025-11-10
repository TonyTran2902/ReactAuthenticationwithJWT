import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config(); // ensure env vars are available even if this module loads before server bootstrap

const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTtl = process.env.ACCESS_TOKEN_TTL || '15m';
const refreshTtl = process.env.REFRESH_TOKEN_TTL || '7d';

if (!accessSecret || !refreshSecret) {
  console.warn('⚠️  ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET missing. Tokens will fail to sign.');
}

export const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user._id,
      email: user.email,
      name: user.name,
    },
    accessSecret,
    { expiresIn: accessTtl }
  );

export const signRefreshToken = (user) =>
  jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    refreshSecret,
    { expiresIn: refreshTtl }
  );

export const verifyAccessToken = (token) => jwt.verify(token, accessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, refreshSecret);
