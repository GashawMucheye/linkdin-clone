import { connect } from 'mongoose';

const connectDb = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI);
    console.log(
      `MongoDb connected:${conn.connection.host}`.bgBlue.white.bgCyan
    );
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
export default connectDb;
