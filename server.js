import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

const clientOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const localOrigins = ['http://localhost:5173', 'http://localhost:3000'];
const allowedOrigins = new Set(isProduction ? clientOrigins : [...clientOrigins, ...localOrigins]);

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const getDbStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
};

const connectToMongo = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not set. Skipping MongoDB connection.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Atlas connected.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    if (isProduction) {
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected.');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: NODE_ENV,
    uptime: process.uptime(),
    database: getDbStatus(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Vinayakart API is running.' });
});

app.post('/api/enquiries', (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    res.status(400).json({ error: 'Name, email, and message are required.' });
    return;
  }

  res.status(202).json({
    message: 'Enquiry received.',
  });
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.status || err.statusCode || 500;
  const message = isProduction && statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({
    error: message,
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

connectToMongo();

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing server.`);
  server.close(async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
