// server/server.js - IntelliDB Express Server Entry Point
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { processNaturalLanguageQuery } = require('./controllers/queryController');
const { getDatabaseSchema } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'IntelliDB Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Database Schema Introspection Endpoint
app.get('/api/schema', async (req, res) => {
  try {
    const schema = await getDatabaseSchema();
    res.json({ success: true, schema });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Main Natural Language to SQL Query Pipeline Endpoint
app.post('/api/query', processNaturalLanguageQuery);

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 IntelliDB Backend Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

module.exports = app;
