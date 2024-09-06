const express = require('express');
const app = express();
require('dotenv').config();   
const PORT = process.env.PORT || 4000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('./features/tokenCleanup/tokenCleanup');

const Routes = require("./routes/routes");
const cors = require('cors');

// Mengatur opsi CORS
let corsOptions = {
  origin: ["http://localhost:3000", 
  "https://boostify-fe.vercel.app",
    ]
};

// Menggunakan middleware CORS
app.use(cors(corsOptions));
app.use(express.json());

// Menangani rute dasar
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Menggunakan rute API
app.use("/api", Routes);

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
