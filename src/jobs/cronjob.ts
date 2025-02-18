import cron from "node-cron";
import { FCMService } from "../services/implementation/fcm.service";
import FCMRepository from "../repositories/implementations/fcm.repository";



const fcmRepository = new FCMRepository()
const fcmService = new FCMService(fcmRepository)


cron.schedule("0 0 * * *", async () => {
    try {
        console.log('cronjob is running..')
        await fcmService.cleanupTokens(); 
        console.log("✅ Old FCM tokens deleted successfully");
      } catch (error) {
        console.error("❌ Error deleting old FCM tokens:", error);
      }
});

console.log("✅ Cron jobs scheduled successfully");
