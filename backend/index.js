require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Import route handlers
const serverRoutes = require('./routes/servers');
const userRoutes = require('./routes/users');

// === Middlewares ===
// Enable Cross-Origin Resource Sharing for your frontend
app.use(cors());
// Enable the Express app to parse JSON formatted request bodies
app.use(express.json());

// === API Routes ===
// All routes starting with '/api/servers' will be handled by serverRoutes
app.use('/api/servers', serverRoutes);
// All routes starting with '/api/users' will be handled by userRoutes
app.use('/api/users', userRoutes);

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});