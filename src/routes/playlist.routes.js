import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  addSongToPlaylist,
  removeSongFromPlaylist,
  getUserPlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();
router.post(
  "/playlist/add",
  authRequired,
  addSongToPlaylist,
);
router.get("/playlist", authRequired, getUserPlaylist);
router.delete("/playlist/:songId", authRequired, removeSongFromPlaylist);
export default router;
