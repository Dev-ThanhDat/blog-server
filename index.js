const express = require('express');
const dbConnect = require('./connectDB/connect');
const initRoutes = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(cookieParser());

dbConnect();
initRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
