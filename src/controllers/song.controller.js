import Song from "../models/song.model.js";
import cloudinary from "../libs/cloudinary.js";

export const getSongs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = { source: "admin" };
    const songs = await Song.find(filter)
      .populate("user", "username")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Song.countDocuments(filter);
    res.json({
      songs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSongs: total,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener canciones" });
  }
};
export const createSong = async (req, res) => {
  try {
    const { title, artist, image, audioUrl, duration } = req.body;
    const audioSource = audioUrl || req.body.audio || req.body.previewUrl;
    if (!audioSource) {
      return res
        .status(400)
        .json({ message: "No se proporcionó una fuente de audio válida" });
    }
    const uploadResponse = await cloudinary.uploader.upload(audioSource, {
      resource_type: "video",
      folder: "wavv_music_songs",
      format: "mp3",
    });
    const newSong = new Song({
      title,
      artist,
      image: image || req.body.cover || "",
      audioUrl: uploadResponse.secure_url,
      duration,
      user: req.user.id,
      source: "admin",
    });
    const savedSong = await newSong.save();
    res.status(201).json(savedSong);
  } catch (error) {
    console.error("DETALLE ERROR CLOUDINARY:", error);
    return res.status(500).json({
      message: "Error al procesar el audio en el servidor",
      details: error.message,
    });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }
    res.json({ message: "Canción eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar canción" });
  }
};

export const searchExternalSongs = async (req, res) => {
  const { search } = req.query;
  if (!search)
    return res.status(400).json({ message: "Se requiere un término" });
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(search)}&entity=song&limit=15`,
    );
    const data = await response.json();
    const results = data.results.map((track) => ({
      id: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      image: track.artworkUrl100.replace("100x100", "600x600"),
      audioUrl: track.previewUrl,
      duration: track.trackTimeMillis,
    }));
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error en búsqueda externa" });
  }
};

export const setTrendingSong = async (req, res) => {
  try {
    await Song.updateMany({ isTrending: true }, { isTrending: false });
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { isTrending: true },
      { new: true },
    );
    if (!song) return res.status(404).json({ message: "No encontrada" });
    res.json({ message: "Trending actualizado", song });
  } catch (error) {
    res.status(500).json({ message: "Error al marcar trending" });
  }
};

export const getTrendingSong = async (req, res) => {
  try {
    const song = await Song.findOne({ isTrending: true });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener trending" });
  }
};
