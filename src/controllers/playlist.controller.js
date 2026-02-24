import Playlist from "../models/playlist.model.js";
import User from "../models/user.model.js";
import Song from "../models/song.model.js";
import mongoose from "mongoose";

export const addSongToPlaylist = async (req, res) => {
  try {
    const { songId, externalSong } = req.body;
    const userId = req.user.id;
    let song;
    if (songId) {
      if (!mongoose.Types.ObjectId.isValid(songId)) {
        return res.status(400).json({
          message: "ID inválido. Use externalSong para canciones externas",
        });
      }
      song = await Song.findById(songId);
      if (!song) {
        return res.status(404).json({ message: "Canción no encontrada" });
      }
      if (song.source === "user" && song.user.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "No permitido usar la canción de otro usuario" });
      }
    } else if (externalSong) {
      song = await Song.findOne({
        title: externalSong.title,
        artist: externalSong.artist,
        user: userId,
      });
      if (!song) {
        song = new Song({
          ...externalSong,
          user: userId,
          source: "user",
        });
        await song.save();
      }
    } else {
      return res.status(400).json({ message: "Datos inválidos" });
    }
    let playlist = await Playlist.findOne({ user: userId });
    if (!playlist) {
      playlist = new Playlist({ user: userId, songs: [] });
    }
    const user = await User.findById(userId);
    const isFreeUser = user.subscription.status === "free";
    if (isFreeUser && playlist.songs.length >= 5) {
      return res.status(403).json({
        message: "Límite de 5 canciones alcanzado. ¡Pasate a premium!",
        code: "PREMIUM_REQUIRED",
      });
    }
    const songExists = playlist.songs.some(
      (s) => s.toString() === song._id.toString(),
    );
    if (songExists) {
      return res.status(400).json({
        code: "SONG_ALREADY_IN_PLAYLIST",
        message: "Esta canción ya está en tu playlist",
      });
    }
    playlist.songs.push(song._id);
    await playlist.save();
    res.json({ message: "Canción agregada a la playlist", song });
  } catch (error) {
    return res.status(500).json({ message: "Error al agregar canción" });
  }
};
export const getUserPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const playlist = await Playlist.findOne({ user: userId });
    if (!playlist || !playlist.songs || playlist.songs.length === 0) {
      return res.json({
        songs: [],
        currentPage: page,
        totalPages: 0,
        totalSongs: 0,
      });
    }
    const totalSongs = playlist.songs.length;
    const paginatedSongIds = playlist.songs.slice(skip, skip + limit);
    const songs = await Song.find({ _id: { $in: paginatedSongIds } });
    const orderedSongs = paginatedSongIds
      .map((id) => songs.find((song) => song._id.toString() === id.toString()))
      .filter(Boolean);
    res.json({
      songs: orderedSongs,
      currentPage: page,
      totalPages: Math.ceil(totalSongs / limit),
      totalSongs: totalSongs,
    });
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
export const cleanPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const playlist = await Playlist.findOne({ user: userId });
    if (!playlist) {
      return res.json({ message: "No hay playlist para limpiar" });
    }
    const validSongs = [];
    for (const songId of playlist.songs) {
      const song = await Song.findById(songId);
      if (song) {
        validSongs.push(songId);
      }
    }
    const total = playlist.songs.length;
    const removed = total - validSongs.length;
    playlist.songs = validSongs;
    await playlist.save();
    res.json({
      message: "Playlist limpiada",
      removed,
      remaining: validSongs.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al limpiar playlist" });
  }
};
