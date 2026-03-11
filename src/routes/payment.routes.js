import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createPreferenceSchema } from "../schemas/payment.schema.js";
import {
  createPreference,
  receiveWebhook,
} from "../controllers/payment.controller.js";

const router = Router();

router.post(
  "/payments/create-preference",
  authRequired,
  validateSchema(createPreferenceSchema),
  createPreference,
);

router.post("/payments/webhook", receiveWebhook);

export default router;