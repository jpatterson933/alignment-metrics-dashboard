import mongoose from "mongoose";
import { config } from "../common/config";

export const connectDB = async () => {
  try {
    const mongoOptions = {
      maxPoolSize: config.DATABASE_POOL_MAX,
      minPoolSize: config.DATABASE_POOL_MIN,
      compressors: config.DATABASE_COMPRESSION,
    };
    await mongoose.connect(
      config.MONGODB_URI || "mongodb://localhost:27017/qti",
      mongoOptions
    );
    console.info("[DB] Connected to MongoDB");
  } catch (error) {
    console.error("[DB] MongoDB connection error:", error);
    process.exit(1);
  }
};
