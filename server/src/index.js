import express from 'express';
import mongodb from '../config/db.js';
import { config } from 'dotenv'

config()
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongodb();



app.listen(process.env.PORT , () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});
