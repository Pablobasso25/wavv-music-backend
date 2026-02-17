import cron from "node-cron";
import User from "../models/user.model.js";
import { sendEmail } from "../controllers/email.controller.js";

export const startSubscriptionChecker = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const twoMinutesFromNow = new Date(now.getTime() + 2 * 60000);

    } catch (error) {
      console.error(" Error en subscription checker:", error);
    }
  });
  
  console.log(" Subscription checker iniciado");
};
