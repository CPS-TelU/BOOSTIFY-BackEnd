const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// require('./features/tokenCleanup/tokenCleanup');

const Routes = require("./routes/routes");
const cors = require('cors');

const allowedOrigins = [
  "https://boostify-fe.vercel.app",
  "http://localhost:3000",
];

app.use(express.json());

// CORS middleware configuration

app.use(cors())
// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps, curl requests)
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       console.error(`CORS error: Origin ${origin} not allowed by CORS`);
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   allowedHeaders: ['Authorization', 'Content-Type'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
// }));

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
