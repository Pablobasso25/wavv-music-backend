import { Router } from "express";
import {
  login,
  logout,
  profile,
  register,
  updateProfile, 
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { authRequired } from "../middlewares/validateToken.js";
import { upload } from "../middlewares/upload.js"; // <<<<<<< AGREGADO

const router = Router();
router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", authRequired, profile);
router.put("/profile", authRequired, upload.single('avatar'), updateProfile); // <<<<<<< AGREGADO

export default router;
