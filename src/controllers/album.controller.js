import Album from "../models/album.model.js";

export const getAlbums = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const albums = await Album.find()
      .populate("user", "username")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Album.countDocuments();

    res.json({
      albums,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAlbums: total,
    });
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

export const getAlbumById = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const album = await Album.findById(req.params.id).populate("user", "username");
    
    if (!album) {
      return res.status(404).json({ message: "Álbum no encontrado" });
    }

    const totalTracks = album.tracks.length;
    const paginatedTracks = album.tracks.slice(skip, skip + limit);

    res.json({
      album: {
        ...album.toObject(),
        tracks: paginatedTracks,
      },
      currentPage: page,
      totalPages: Math.ceil(totalTracks / limit),
      totalTracks: totalTracks,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener álbum" });
  }
};