import User from '../models/User.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/token.js';

const buildAuthPayload = (user, accessToken, refreshToken) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
  accessToken,
  refreshToken,
});

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await user.setRefreshToken(refreshToken);

  return res.json(buildAuthPayload(user, accessToken, refreshToken));
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Refresh token invalid' });
    }

    const accessToken = signAccessToken(user);

    return res.json(buildAuthPayload(user, accessToken));
  } catch (error) {
    return res.status(403).json({ message: 'Refresh token expired or invalid' });
  }
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token missing' });
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    return res.status(400).json({ message: 'Refresh token invalid' });
  }

  const user = await User.findById(payload.sub);
  if (user && user.refreshToken === refreshToken) {
    await user.clearRefreshToken();
  }

  return res.json({ message: 'Logged out successfully' });
};
