import http from "http";
import dotenv from "dotenv";
import Stripe from "stripe";
import { connectToDb } from "./config/db.config";
import app from "./app";
import { initializeSocket } from "./socket";
import "./jobs/cronjob";
import logger from "./config/logger.config";

dotenv.config();

const requiredEnvVars = ["MONGO_URI", "STRIPE_SK"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`Error: ${envVar} is not defined in the environment variables`);
    process.exit(1);
  }
}

const server = http.createServer(app);
const stripe = new Stripe(process.env.STRIPE_SK!);

initializeSocket(server);

async function startServer() {
  const PORT = parseInt(process.env.PORT || "4040", 10);

  try {
    await connectToDb();
    logger.info("Database connection established");
    console.log('mongo db connected successfully')
    server.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });
  } catch (error) {
    logger.error({ error }, "Failed to connect to MongoDB. Exiting...");
    process.exit(1);
  }
}

startServer();

export { server, stripe };