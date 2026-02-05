import Playlist from "../models/playlist.model.js";
import User from "../models/user.model.js";

export const addSongToPlaylist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { songId } = req.body;
    } catch (error) {
        
    }
}