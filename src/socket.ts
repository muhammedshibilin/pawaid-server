import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { RecruiterRepository } from "./repositories/implementations/recruiter.repository";
import logger from "./config/logger.config";

const recruiterRepository = new RecruiterRepository();
let io: Server | undefined;

export const initializeSocket = (server: HttpServer): Server => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: ["http://localhost:4200", "https://pawaid-client.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      logger.info(`Recruiter Connected: ${socket.id}`);

      socket.on("updateLocation", async (data) => {
        logger.info({ data }, "Location Update received");
        const { recruiterId, latitude, longitude } = data;

        try {
          const updatedRecruiter = await recruiterRepository.updateRecruiterLocation(
            recruiterId,
            latitude,
            longitude
          );

          if (updatedRecruiter) {
            logger.info({ updatedRecruiter }, "Recruiter location updated");
          } else {
            logger.warn("Failed to update recruiter location");
          }
        } catch (error) {
          logger.error({ error }, "Error updating recruiter location");
        }
      });

      socket.on("disconnect", () => {
        logger.info(`Recruiter Disconnected: ${socket.id}`);
      });
    });
  }

  return io;
};

export const getSocketInstance = (): Server => {
  if (!io) {
    logger.error("Socket.io is not initialized");
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};