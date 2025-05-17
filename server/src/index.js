import express from 'express';
import mongodb from '../config/db.js';
import { config } from 'dotenv'
import adminroute from '../routes/admin.route.js';

config()
const app = express();

// Middleware to parse JSON
app.use(express.json());


app.use('/api/admin',adminroute);
// Connect to MongoDB
mongodb();

const port=process.env.PORT || 8080;

app.listen(port , () => {
  console.log(`Server is running on port: ${port}`);
});
