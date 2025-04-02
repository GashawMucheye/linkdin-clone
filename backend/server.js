import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './config/db.js';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running now on port ${PORT}`.bgYellow.underline.bold);
  connectDb();
});
