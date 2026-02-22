import { Router } from "express";
import {
  profile,
  updateProfile,
  changePassword,
  getAllUsers,
  deactivateUser,
  activateUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { upload } from "../middlewares/upload.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { changePasswordSchema, updateUserSchema } from "../schemas/user.schema.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();
router.get("/profile", authRequired, profile);
router.put("/profile", authRequired, upload.single("avatar"), updateProfile);
router.put(
  "/password",
  authRequired,
  validateSchema(changePasswordSchema),
  changePassword,
);
router.get("/users", [authRequired, isAdmin], getAllUsers);
router.put("/users/:id/deactivate", [authRequired, isAdmin], deactivateUser);
router.put("/users/:id/activate", [authRequired, isAdmin], activateUser);
router.put("/users/:id", [authRequired, isAdmin, validateSchema(updateUserSchema)], updateUser);
router.delete("/users/:id", [authRequired, isAdmin], deleteUser);

export default router;
