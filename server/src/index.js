import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';
import { seedDefaultUser } from './utils/seedUser.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = process.env.CLIENT_URL?.split(',').map((url) => url.trim());

app.use(
  cors({
    origin: allowedOrigins || '*',
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error', details: err.message });
});

const start = async () => {
  try {
    await connectDB();
    await seedDefaultUser();
    app.listen(port, () => {
      console.log(`🚀 API ready on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

start();
