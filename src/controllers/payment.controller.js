import { MercadoPagoConfig, Preference } from "mercadopago";
import User from "../models/user.model.js";
import { sendEmail } from "./email.controller.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export const createPreference = async (req, res) => {
  try {
    const { planType, price } = req.body;
    const preference = new Preference(client);

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

    const preferenceBody = {
        items: [
          {
          id: planType.toLowerCase(),
          title: `Wavv Music - ${planType}`,
            quantity: 1,
            unit_price: Number(price),
            currency_id: "ARS",
          },
        ],
        back_urls: {
        success: `${FRONTEND_URL}/payment-success`,
          failure: `${FRONTEND_URL}/subscription`,
        pending: `${FRONTEND_URL}/subscription``,
        },
      auto_return: FRONTEND_URL.includes("localhost") ? undefined : "approved", 
      binary_mode: true,
      notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
        external_reference: String(req.user.id),
    };

    const result = await preference.create({ body: preferenceBody });
    return res.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error("--- ERROR MERCADO PAGO ---", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const receiveWebhook = async (req, res) => {
  console.log("Webhook recibido:", req.query);
    const { query } = req;
    const topic = query.topic || query.type;

  if (topic !== "payment") {
    return res.sendStatus(200);
  }

  try {
      const paymentId = query.id || query["data.id"];
      const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`⁠,
        {
          headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`⁠,
        },
          },
      );

      const data = await response.json();
    console.log("Datos del pago:", data);

      if (data.status === "approved") {
        const userId = data.external_reference;
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30);

      const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            "subscription.status": "premium",
            "subscription.startDate": new Date(),
            "subscription.mp_preference_id": data.id,
          },
          { new: true }
        );
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error en Webhook:", error.message);
    res.sendStatus(500);
  }
};