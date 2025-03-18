import mongoose from "mongoose";
import logger from "./logger.config";
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.MONGO_URI) {
  logger.error("MONGO_URI is not defined in the environment variables");
  throw new Error("MONGO_URI is not defined in the environment variables");
}

export async function connectToDb() {
  try {
    logger.info(`Connecting to MongoDB with URI: ${process.env.MONGO_URI}`);
    await mongoose.connect(process.env.MONGO_URI!, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000, 
      heartbeatFrequencyMS: 10000,
    });

    mongoose.connection.on("connected", () => logger.info("Mongoose connected to MongoDB"));
    mongoose.connection.on("disconnected", () => logger.warn("Mongoose disconnected from MongoDB"));
    mongoose.connection.on("reconnected", () => logger.info("Mongoose reconnected to MongoDB"));
    mongoose.connection.on("error", (error) => logger.error({ error }, "Mongoose connection error"));

    logger.info("Successfully connected to MongoDB using Mongoose");
  } catch (error) {
    logger.error({ error }, "Error connecting to MongoDB");
    throw error; 
  }
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}