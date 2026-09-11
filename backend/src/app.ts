import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import apiRoutes from './routes';

import { getHealth } from './controllers/health.controller';

const app = express();

// Parse CORS Origins from environment variables (comma-separated if multiple)
const configuredOrigins = config.corsOrigin ? config.corsOrigin.split(',').map((o) => o.trim()) : [];
const defaultDevOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOrigins = Array.from(new Set([...configuredOrigins, config.frontendUrl, ...(config.isProduction ? [] : defaultDevOrigins)])).filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, mobile app, cURL)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*') || (!config.isProduction && (origin.includes('localhost') || origin.includes('127.0.0.1')))) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy blocked access for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-robot-key'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Direct health check routes for reliable cloud health probes and API endpoints
app.get('/api/health', getHealth);
app.get('/health', getHealth);
app.get('/', getHealth);

// Mount API routes under /api
app.use('/api', apiRoutes);

export default app;
