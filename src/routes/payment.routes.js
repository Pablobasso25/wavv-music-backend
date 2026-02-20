import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createPreferenceSchema } from "../schemas/payment.schema.js";
import { createPreference } from "../controllers/payment.controller.js";
import { sendEmail } from "../controllers/email.controller.js";
import User from "../models/user.model.js";

const router = Router();

router.post(
  "/payments/create-preference",
  authRequired,
  validateSchema(createPreferenceSchema),
  createPreference,
);
router.post("/payments/webhook", async (req, res) => {
  const { query } = req;
  const topic = query.topic || query.type;

  try {
    if (topic === "payment") {
      const paymentId = query.id || query["data.id"];
      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
        },
      );
      const data = await response.json();

      if (data.status === "approved") {
        const userId = data.external_reference;
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMinutes(endDate.getMinutes() + 5);

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            "subscription.status": "premium",
            "subscription.mp_preference_id": data.order.id,
            "subscription.startDate": startDate,
            "subscription.endDate": endDate,
          },
          { new: true },
        );
        sendEmail({
          to_name: updatedUser.username,
          to_email: updatedUser.email,
          asunto_dinamico: "¡Ahora sos Premium en Wavv Music!",
          cuerpo_mensaje: `¡Felicidades! Tu suscripción Premium ha sido activada. Disfruta de música sin anuncios, playlist ilimitada y calidad superior. Tu suscripción expira el ${endDate.toLocaleString()}.`,
        }).catch(() => {});
      }
    }
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get("/payments/success", (req, res) => {
  res.redirect("http://localhost:5173/profile");
});

router.get("/payments/failure", (req, res) => {
  res.redirect("http://localhost:5173/subscription");
});

router.get("/payments/pending", (req, res) => {
  res.redirect("http://localhost:5173/subscription");
});

export default router;
