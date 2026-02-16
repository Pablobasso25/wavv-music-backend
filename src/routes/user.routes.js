import { Router } from "express";
import {
  profile,
  updateProfile,
  changePassword,
} from "../controllers/user.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { upload } from "../middlewares/upload.js";

const router = Router();
router.get("/profile", authRequired, profile);
router.put("/profile", authRequired, upload.single("avatar"), updateProfile);
router.put("/password", authRequired, changePassword);

export default router;
