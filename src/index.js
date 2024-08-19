const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Routes = require("./routes/routes");
const attendanceRoutes = require('./routes/routes');
const personalRecords = require('./routes/routes');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use("/api", Routes);

// app.use(cors({
// origin: [link]
// }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
