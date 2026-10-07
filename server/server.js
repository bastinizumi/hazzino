import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import inquiryRoutes from './routes/inquiryRoutes.js';
import furnitureRoutes from './routes/furnitureRoutes.js';

const app = express();
const PORT = process.env.PORT || 5002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hazzino_interiors';

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/furniture', furnitureRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Hazzino Interiors MERN API',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Graceful MongoDB connection attempt
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 3000,
  })
  .then(() => {
    console.log('✓ Connected to MongoDB (hazzino_interiors)');
  })
  .catch((err) => {
    console.warn('MongoDB connection pending or local daemon not active:', err.message);
    console.warn('Using resilient in-memory storage fallback for inquiries.');
  });

app.listen(PORT, () => {
  console.log(`✓ Hazzino Interiors Server listening on port ${PORT}`);
});
