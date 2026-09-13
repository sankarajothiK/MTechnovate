const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');

// Initialize database
const db = require('./db');

const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON & URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded assets statically
const uploadsPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'M TECHNOVATE API',
    uptime: process.uptime()
  });
});

// Mount API routes
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// In production, serve the built Vite frontend
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  M TECHNOVATE Enterprise Server Running on port ${PORT}`);
  console.log(`  API Endpoint: http://localhost:${PORT}/api`);
  console.log(`  Uploads:      http://localhost:${PORT}/uploads`);
  console.log(`====================================================`);

  // Automated Render Keep-Alive: Pings the service every 10 minutes to prevent the 15-minute idle sleep
  const serviceUrl = process.env.RENDER_EXTERNAL_URL || process.env.SERVICE_URL;
  if (serviceUrl) {
    const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes
    setInterval(async () => {
      try {
        const pingUrl = `${serviceUrl}/api/health`;
        const res = await fetch(pingUrl);
        if (res.ok) {
          console.log(`[Render Keep-Alive] Pinged ${pingUrl} successfully at ${new Date().toISOString()}`);
        }
      } catch (err) {
        console.warn(`[Render Keep-Alive] Ping notification: ${err.message}`);
      }
    }, PING_INTERVAL);
    console.log(`  Keep-Alive:   Active (Pinging ${serviceUrl}/api/health every 10 mins)`);
  }
});
