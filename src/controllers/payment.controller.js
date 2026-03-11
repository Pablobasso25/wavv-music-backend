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
        pending: `${FRONTEND_URL}/subscription`,
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
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
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
          "subscription.mp_preference_id": data.order.id, 
          "subscription.startDate": startDate,
          "subscription.endDate": endDate,
        },
        { new: true },
      );

      console.log("Usuario actualizado a premium:", updatedUser.email);

      const plan = data.description === 'Wavv Music - Premium' ? 'Premium' : 'Free'

      const payment = new Payment({
        user: userId,
        paymentId: data.id,
        status: data.status,
        amount: data.transaction_amount,
        plan,
        paymentDate: data.date_created
      })

      await payment.save()

      try {
        await sendEmail({
          to_name: updatedUser.username,
          to_email: updatedUser.email,
          asunto_dinamico: "¡Ahora sos Premium en Wavv Music!",
          cuerpo_mensaje: `¡Felicidades! Tu suscripción Premium ha sido activada. Disfruta de música sin anuncios, playlist ilimitada y calidad superior. Tu suscripción expira el ${endDate.toLocaleString()}.`,
        });
        console.log("Email de confirmación enviado a:", updatedUser.email);
      } catch (emailError) {
        console.error("Error enviando email de confirmación:", emailError);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error procesando webhook de Mercado Pago:", error.message);
    res.sendStatus(500);
  }
};