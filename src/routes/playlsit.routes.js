import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { addSongToPlaylist } from "../controllers/playlist.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { addSongSchema } from "../schemas/playlist.schema.js";


const router = Router();
router.post(
  "/playlist/add",
  authRequired,
  validateSchema(addSongSchema),
  addSongToPlaylist,
);

export default router;