import { Router } from "express";
import { getAlbums, createAlbum, deleteAlbum, getAlbumById } from "../controllers/album.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();
router.get("/albums", authRequired, getAlbums);
router.get("/albums/:id", authRequired, getAlbumById);
router.post("/albums", [authRequired, isAdmin], createAlbum);
router.delete("/albums/:id", [authRequired, isAdmin], deleteAlbum);

export default router;