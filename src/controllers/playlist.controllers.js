import Playlist from "../models/playlist.model.js";
import User from "../models/user.model.js";

export const addSongToPlaylist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { songId } = req.body;

        const user = await User.findById(userId);
        let playlist = await Playlist.findOne({ user: userId });

        if (!playlist) {
            playlist = new Playlist ({ user: userId, songs: [] });
        }

        if (user.subscription.status === "free" && playlist.songs.length >= 5) {
            return res.status(403).json({
                message: "Límite de 5 canciones alcanzado. ¡Pasate a premium!",
                code: "PREMIUM_REQUIRED"
            });
        }

            if(!playlist.songs.includes(songId)) {
                playlist.songs.push(songId);
                await playlist.save();
            }

        res.json({message: "Canción añadida con éxito", playlist});
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la playlist"});
    }
};