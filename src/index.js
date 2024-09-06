const express = require('express');
const app = express();
require('dotenv').config();   
const PORT = process.env.PORT || 4000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('./features/tokenCleanup/tokenCleanup');

const Routes = require("./routes/routes");
const cors = require('cors');

const allowedOrigins = [
  "https://boostify-front-end.vercel.app",
  "http://boostify-fe.vercel.app",
  "http://localhost:3000",
];

app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
})
app.use("/api", Routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});