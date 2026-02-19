import { Router } from "express";
import { getSongs, createSong, searchExternalSongs, deleteSong, setTrendingSong, getTrendingSong  } from "../controllers/song.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();
router.get("/songs", authRequired, getSongs);
router.post("/songs", [authRequired, isAdmin], createSong);
router.get("/search-external", authRequired, searchExternalSongs);
router.put("/songs/:id/trending", [authRequired, isAdmin], setTrendingSong);
router.get("/songs/trending", authRequired, getTrendingSong); 
router.delete("/songs/:id", [authRequired, isAdmin], deleteSong);
export default router;