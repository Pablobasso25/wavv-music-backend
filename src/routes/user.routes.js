import { Router } from "express";
import {
  profile,
  updateProfile,
  changePassword,
} from "../controllers/user.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { upload } from "../middlewares/upload.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { changePasswordSchema } from "../schemas/user.schema.js";

const router = Router();
router.get("/profile", authRequired, profile);
router.put("/profile", authRequired, upload.single("avatar"), updateProfile);
router.put("/password", authRequired, validateSchema(changePasswordSchema), changePassword);

export default router;
