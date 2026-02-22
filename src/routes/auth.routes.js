import { Router } from "express";
import {
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { forgotPasswordSchema } from "../schemas/auth.schema.js";``

const router = Router();
router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post(
  "/forgot-password",
  validateSchema(forgotPasswordSchema),
  forgotPassword
);

export default router;
