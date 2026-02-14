import Playlist from "../models/playlist.model.js";
import User from "../models/user.model.js";

export const addSongToPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.body;

    const user = await User.findById(userId);
    let playlist = await Playlist.findOne({ user: userId });

    if (!playlist) {
      playlist = new Playlist({ user: userId, songs: [] });
    }

    const isFreeUser = user.subscription.status === "free";

    if (isFreeUser && playlist.songs.length >= 5) {
      return res.status(403).json({
        message: "Límite de 5 canciones alcanzado. ¡Pasate a premium!",
        code: "PREMIUM_REQUIRED",
      });
    }
    const songExists = playlist.songs.some(
      (song) => song.toString() === songId,
    );

    if (songExists) {
      return res
        .status(200)
        .json({ message: "La canción ya estaba en tu playlist", playlist });
    }
    playlist.songs.push(songId);
    await playlist.save();

    res.json({ message: "Canción añadida con éxito", playlist });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la playlist" });
  }
};

export const getUserPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const playlist = await Playlist.findOne({ user: userId }).populate("songs");

    if (!playlist) {
      return res.json([]);
    }

    res.json(playlist.songs);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la playlist" });
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.params;

    const playlist = await Playlist.findOne({ user: userId });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist no encontrada" });
    }

    playlist.songs.pull(songId);
    await playlist.save();

    res.json({ message: "Canción eliminada", playlist });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar canción" });
  }
};
