import http from 'http';
import app from './app';
import { config } from './config/env';

const server = http.createServer(app);

// Placeholder: Socket.IO initialization will be added here in future steps

server.listen(config.port, '0.0.0.0', () => {
  console.log(`[Pothole Detection System Backend] Server running on port ${config.port} (0.0.0.0)`);
  console.log(`[Pothole Detection System Backend] Health check endpoint: /api/health`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
