import User from "../models/user.model.js";
import Plan from "../models/plan.model.js";
import { sendEmail } from "../controllers/email.controller.js";

export const checkSubscriptionsJob = async (req, res) => {
  try {
    const now = new Date();

    const DAYS_TO_WARN = 3;
    const warningDate = new Date(now);
    warningDate.setDate(now.getDate() + DAYS_TO_WARN);

    const expiringUsers = await User.find({
      "subscription.status": "premium",
      "subscription.endDate": {
        $gte: now,
        $lte: warningDate,
      },
      "subscription.warningEmailSent": { $ne: true },
    });

    for (const user of expiringUsers) {
      await sendEmail({
        to_name: user.username,
        to_email: user.email,
        asunto_dinamico: "Tu suscripción Premium está por terminar",
        cuerpo_mensaje: `Hola ${user.username}, te recordamos que tu suscripción Premium vencerá el ${user.subscription.endDate.toLocaleDateString()}. Renueva pronto para mantener tus beneficios.`,
      });

      user.subscription.warningEmailSent = true;
      await user.save();
    }

    const freePlan = await Plan.findOne({ name: "Free" });

    const result = await User.updateMany(
      {
        "subscription.status": "premium",
        "subscription.endDate": { $lt: now },
      },
      {
        $set: {
          "subscription.status": "free",
          "subscription.warningEmailSent": false,
          "subscription.adInterval": freePlan ? freePlan.adInterval : 3,
          "subscription.playlistLimit": freePlan ? freePlan.playlistLimit : 5,
        },
      },
    );

    if (result.modifiedCount > 0) {
      console.log(
        `[CronJob] ${result.modifiedCount} suscripciones expiradas y cambiadas a free.`,
      );
    }
    if (res)
      return res
        .status(200)
        .json({ message: "Revisión completa", modified: result.modifiedCount });
  } catch (error) {
    console.error(" Error en el checker de suscripciones:", error);
    if (res) return res.status(500).json({ message: "Error en el checker" });
  }
};
