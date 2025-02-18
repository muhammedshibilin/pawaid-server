import { Server } from 'socket.io';
import http from 'http';
import { RecruiterRepository } from './repositories/implementations/recruiter.repository';

const recruiterRepository = new RecruiterRepository();
let io: Server; 

export const initializeSocket = (server: http.Server) => {
  if (!io) { 
    io = new Server(server, {
      cors: { origin: 'http://localhost:4200' }
    });

    io.on('connection', (socket) => {
      console.log('✅ Recruiter Connected:', socket.id);

      socket.on('updateLocation', async (data) => {
        console.log('📍 Location Update:', data);
        const { recruiterId, latitude, longitude } = data;

        const updatedRecruiter = await recruiterRepository.updateRecruiterLocation(
          recruiterId,
          latitude,
          longitude
        );

        if (updatedRecruiter) {
          console.log('✅ Recruiter location updated:', updatedRecruiter);
        } else {
          console.log('❌ Failed to update recruiter location');
        }
      });

      socket.on('disconnect', () => {
        console.log('❌ Recruiter Disconnected:', socket.id);
      });
    });
  }

  return io;
};

export const getSocketInstance = (): Server => {
  if (!io) {
    throw new Error('❌ Socket.io is not initialized!');
  }
  return io;
};
