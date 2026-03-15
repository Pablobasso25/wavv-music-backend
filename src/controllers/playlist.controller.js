import Playlist from "../models/playlist.model.js";
import User from "../models/user.model.js";
import Song from "../models/song.model.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

export const addSongToPlaylist = async (req, res) => {
  try {
    const { songId, externalSong } = req.body;
    const userId = req.user.id;
    let song;

    if (songId) {
      if (!mongoose.Types.ObjectId.isValid(songId)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      song = await Song.findById(songId);
      if (!song)
        return res.status(404).json({ message: "Canción no encontrada" });
    } else if (externalSong) {
      song = await Song.findOne({
        title: externalSong.title,
        artist: externalSong.artist,
      });

      if (!song) {
        const itunesLink =
          externalSong.audioUrl ||
          externalSong.preview_url ||
          externalSong.previewUrl ||
          externalSong.audio;

        if (!itunesLink) {
          return res
            .status(400)
            .json({ message: "La canción no tiene una URL de audio válida" });
        }
        const uploadResponse = await cloudinary.uploader.upload(itunesLink, {
          resource_type: "video",
          folder: "wavv_music_songs",
          format: "mp3",
        });
        song = new Song({
          title: externalSong.title || "Sin título",
          artist: externalSong.artist || "Artista desconocido",
          image: externalSong.image || externalSong.cover || "",
          audioUrl: uploadResponse.secure_url,
          duration: externalSong.duration || "--:--",
          user: userId,
          source: "user",
        });
        await song.save();
      }
    } else {
      return res.status(400).json({ message: "Faltan datos de la canción" });
    }

    let playlist = await Playlist.findOne({ user: userId });
    if (!playlist) {
      playlist = new Playlist({ user: userId, songs: [] });
    }

    const user = await User.findById(userId);
    const limit = user.subscription.playlistLimit ?? 5;

    if (playlist.songs.length >= limit) {
      return res.status(403).json({
        message:
          `Límite de ${limit} canciones alcanzado. ${user.subscription.status === "free" ? "¡Pasate a premium!" : ""}`.trim(),
        code: "PREMIUM_REQUIRED",
      });
    }
    const songExists = playlist.songs.some(
      (s) => s.toString() === song._id.toString(),
    );
    if (songExists) {
      return res.status(400).json({
        message: "Esta canción ya está en tu playlist",
        code: "SONG_ALREADY_IN_PLAYLIST",
      });
    }

    playlist.songs.push(song._id);
    await playlist.save();

    res.json({
      message: "Canción estandarizada y agregada a la playlist",
      song,
    });
  } catch (error) {
    console.error("CRASH EN ADD_TO_PLAYLIST:", error);
    return res.status(500).json({
      message: "Error interno al procesar la playlist",
      error: error.message,
    });
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
    if (!playlist)
      return res.status(404).json({ message: "Playlist no encontrada" });

    playlist.songs.pull(songId);
    await playlist.save();

    res.json({ message: "Canción eliminada de la playlist", playlist });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar canción" });
  }
};

export const cleanPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const playlist = await Playlist.findOne({ user: userId });

    if (!playlist) return res.json({ message: "No hay playlist para limpiar" });

    const existingSongs = await Song.find({
      _id: { $in: playlist.songs },
    }).select("_id");
    const existingSongIds = existingSongs.map((s) => s._id.toString());
    const validSongs = playlist.songs.filter((songId) =>
      existingSongIds.includes(songId.toString()),
    );

    const removed = playlist.songs.length - validSongs.length;
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
