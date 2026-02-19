import Album from "../models/album.model.js";

export const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find().populate("user", "username");
    res.json(albums);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener álbumes" });
  }
};