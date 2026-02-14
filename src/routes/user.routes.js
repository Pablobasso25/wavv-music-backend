import { Router } from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/user.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { upload } from "../middlewares/upload.js";

const router = Router();
router.get("/profile", authRequired, getProfile);
router.put("/profile", authRequired, upload.single("avatar"), updateProfile);
router.put("/password", authRequired, changePassword);

export default router;
