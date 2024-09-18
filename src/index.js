const express = require('express');
const app = express();
const WebSocket = require('ws');
const http = require('http');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// require('./features/tokenCleanup/tokenCleanup');

const Routes = require("./routes/routes");
const cors = require('cors');

app.use(express.json());

let corsOptions = {
  origin: ["http://localhost:3000", 
  "https://boostify-fe.vercel.app",
    ]
};
app.use(cors(corsOptions));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Test route to verify server is running
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Main routes
app.use("/api", Routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
