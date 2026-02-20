import { MercadoPagoConfig, Preference } from "mercadopago";
import User from "../models/user.model.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export const createPreference = async (req, res) => {
  try {
    const { planType, price } = req.body;
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: `Wavv Music - ${planType}`,
            quantity: 1,
            unit_price: Number(price),
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: `${FRONTEND_URL}/profile`, 
          failure: `${FRONTEND_URL}/subscription`,
          pending: `${FRONTEND_URL}/subscription`,
        },
        notification_url: `${BACKEND_URL}/api/payments/webhook`,
        external_reference: String(req.user.id),
      },
    });
    return res.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const receiveWebhook = async (req, res) => {
  try {
    const { query } = req;
    const topic = query.topic || query.type;

    if (topic === "payment") {
      const paymentId = query.id || query["data.id"];

      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      const data = await response.json();

      if (data.status === "approved") {
        const userId = data.external_reference;

        const updated = await User.findByIdAndUpdate(
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