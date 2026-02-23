import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  addSongToPlaylist,
  removeSongFromPlaylist,
  getUserPlaylist,
  cleanPlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();
router.post(
  "/playlist/add",
  authRequired,
  addSongToPlaylist,
);
router.get("/playlist", authRequired, getUserPlaylist);
router.post("/playlist/clean", authRequired, cleanPlaylist);
router.delete("/playlist/:songId", authRequired, removeSongFromPlaylist);
export default router;
