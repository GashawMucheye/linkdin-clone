import express from 'express';
import colors from 'colors';
// Removed unused 'colors' import
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './config/db.js';
import authRoute from './routes/authRoute.js';
import userRoutes from './routes/userRoute.js';
import postRoutes from './routes/postRoute.js';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorMiddleware.js';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use(errorHandler);

app.get('/', (_, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running now on port ${PORT}`.bgYellow.underline.bold);
  connectDb();
});
