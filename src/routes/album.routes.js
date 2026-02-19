import { Router } from "express";
import { getAlbums, createAlbum, deleteAlbum } from "../controllers/album.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();
router.get("/albums", authRequired, getAlbums);
router.post("/albums", [authRequired, isAdmin], createAlbum);
router.delete("/albums/:id", [authRequired, isAdmin], deleteAlbum);

export default router;