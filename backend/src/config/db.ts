import mongoose from 'mongoose';
import logger from '../utils/logger';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not defined in environment variables");
    const conn = await mongoose.connect(uri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.warn(`Could not connect to configured MONGO_URI. Falling back to an in-memory database...`);
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      logger.info(`In-Memory MongoDB Connected: ${conn.connection.host}`);
    } catch (memError: any) {
      logger.error(`Error starting in-memory database: ${memError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
