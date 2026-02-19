import Album from "../models/album.model.js";

export const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find().populate("user", "username");
    res.json(albums);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener álbumes" });
  }
};

export const createAlbum = async (req, res) => {
  try {
    const { collectionId, name, artistName, image, tracks } = req.body;
    const newAlbum = new Album({
      collectionId,
      name,
      artistName,
      image,
      tracks,
      user: req.user.id,
    });
    const savedAlbum = await newAlbum.save();
    res.status(201).json(savedAlbum);
  } catch (error) {
    return res.status(500).json({ message: "Error al guardar el álbum" });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) {
      return res.status(404).json({ message: "Álbum no encontrado" });
    }
    res.json({ message: "Álbum eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar álbum" });
  }
};