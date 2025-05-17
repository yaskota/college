import express from 'express';
import mongodb from '../config/db.js';
import dotenv from 'dotenv'

const app = express();

// Middleware to parse JSON
app.use(express.json());
dotenv.config()
// Connect to MongoDB
mongodb();

const PORT = 8080;

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
