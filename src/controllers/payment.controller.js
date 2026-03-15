import { MercadoPagoConfig, Preference } from "mercadopago";
import User from "../models/user.model.js";
import { sendEmail } from "./email.controller.js";
import Payment from "../models/payment.model.js";
import Plan from "../models/plan.model.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export const createPreference = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ message: "Plan no encontrado o inactivo" });
    }
    const preference = new Preference(client);

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

    const preferenceBody = {
      items: [
        {
          id: plan._id,
          title: `Wavv Music - ${plan.name}`,
          quantity: 1,
          unit_price: Number(plan.price),
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

    if (data.status === "approved") {
      const userId = data.external_reference;
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30);

      const planId = data.additional_info.items[0].id;
      const plan = await Plan.findById(planId);

      if (!plan) {
        console.error("Plan no encontrado para el pago:", data.id);
        return res.sendStatus(400);
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          "subscription.status": "premium",
          "subscription.mp_preference_id": data.order?.id,
          "subscription.plan": plan._id,
          "subscription.startDate": startDate,
          "subscription.endDate": endDate,
          "subscription.adInterval": plan.adInterval ?? 0,
          "subscription.playlistLimit": plan.playlistLimit ?? 9999,
        },
        { new: true },
      );

      if (!updatedUser) {
        console.error(
          `Pago aprobado pero el usuario ${userId} ya no existe en la DB.`,
        );
        return res.sendStatus(404);
      }

      const payment = new Payment({
        user: userId,
        paymentId: data.id,
        status: data.status,
        amount: data.transaction_amount,
        plan: plan._id,
        paymentDate: data.date_created,
      });

      await payment.save();

      try {
        await sendEmail({
          to_name: updatedUser.username,
          to_email: updatedUser.email,
          asunto_dinamico: "¡Ahora sos Premium en Wavv Music!",
          cuerpo_mensaje: `¡Felicidades! Tu suscripción Premium ha sido activada. Disfruta de música sin anuncios, playlist ilimitada y calidad superior. Tu suscripción expira el ${endDate.toLocaleDateString()}.`,
        });
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
