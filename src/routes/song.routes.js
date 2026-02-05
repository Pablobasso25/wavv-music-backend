import { Router } from "express";
import { getSongs, createSong, searchExternalSongs } from "../controllers/song.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();
router.get("/songs", authRequired, getSongs);
router.post("/songs", [authRequired, isAdmin], createSong);
router.get("/search-external", authRequired, searchExternalSongs);
export default router;