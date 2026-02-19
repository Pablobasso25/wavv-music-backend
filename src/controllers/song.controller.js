import Song from "../models/song.model.js";

export const getSongs = async (req, res) => {
  try {
    const songs = await Song.find().populate("user", "username");
    res.json(songs);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener canciones" });
  }
};

export const createSong = async (req, res) => {
  try {
    const { title, artist, image, youtubeUrl, duration } = req.body;
    const newSong = new Song({
      title,
      artist,
      image,
      youtubeUrl,
      duration,
      user: req.user.id,
    });
    const savedSong = await newSong.save();
    res.status(201).json(savedSong);
  } catch (error) {
    return res.status(500).json({ message: "Error al guardar la cancion" });
  }
};

export const searchExternalSongs = async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res
      .status(400)
      .json({ message: "Se requiere un término de búsqueda" });
  }

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(search)}&entity=song&limit=15`,
    );

    const data = await response.json();

    if (data.resultCount === 0) {
      return res.status(404).json({ message: "No se encontraron canciones" });
    }

    const results = data.results.map((track) => ({
      id: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      album: track.collectionName,
      image: track.artworkUrl100.replace("100x100", "600x600"),
      audio: track.previewUrl,
      duration_ms: track.trackTimeMillis,
    }));

    res.json(results);
  } catch (error) {
    console.error("Error de búsqueda en iTunes:", error);

    res.status(500).json({
      message: "Error interno al buscar canciones en el servidor externo",
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
export const setTrendingSong = async (req, res) => {
  try {
    await Song.updateMany({}, { isTrending: false });
    
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { isTrending: true },
      { new: true }
    );
    
    if (!song) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }
    
    res.json({ message: "Canción marcada como trending", song });
  } catch (error) {
    return res.status(500).json({ message: "Error al marcar trending" });
  }
};
export const getTrendingSong = async (req, res) => {
  try {
    const song = await Song.findOne({ isTrending: true });
    res.json(song);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener trending" });
  }
};