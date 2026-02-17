import cron from "node-cron";
import User from "../models/user.model.js";
import { sendEmail } from "../controllers/email.controller.js";

export const startSubscriptionChecker = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const twoMinutesFromNow = new Date(now.getTime() + 2 * 60000);

      const expiringUsers = await User.find({
        "subscription.status": "premium",
        "subscription.endDate": {
          $gte: now,
          $lte: twoMinutesFromNow,
        },
        "subscription.warningEmailSent": { $ne: true },
      });

      for (const user of expiringUsers) {
        await sendEmail({
          to_name: user.username,
          to_email: user.email,
          asunto_dinamico: "Tu suscripción Premium está por expirar",
          cuerpo_mensaje: `Tu suscripción Premium expira el ${user.subscription.endDate.toLocaleString()}. Renueva ahora para seguir disfrutando sin interrupciones.`,
        });

        user.subscription.warningEmailSent = true;
        await user.save();
      }

      const result = await User.updateMany(
        {
          "subscription.status": "premium",
          "subscription.endDate": { $lt: now },
        },
        {
          $set: {
            "subscription.status": "free",
            "subscription.warningEmailSent": false,
          },
        },
      );

      if (result.modifiedCount > 0) {
        console.log(` ${result.modifiedCount} suscripciones expiradas`);
      }
    } catch (error) {
      console.error(" Error en subscription checker:", error);
    }
  });

  console.log(" Subscription checker iniciado");
};
