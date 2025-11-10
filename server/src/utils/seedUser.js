import User from '../models/User.js';

export const seedDefaultUser = async () => {
  const email = process.env.DEFAULT_USER_EMAIL;
  const password = process.env.DEFAULT_USER_PASSWORD;
  const name = process.env.DEFAULT_USER_NAME || 'Demo User';

  if (!email || !password) {
    console.warn('⚠️  DEFAULT_USER_EMAIL or DEFAULT_USER_PASSWORD missing. Seed skipped.');
    return;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log(`ℹ️  Default user already exists (${email})`);
    return;
  }

  await User.create({ email, password, name });
  console.log(`✅ Created default user (${email})`);
};
