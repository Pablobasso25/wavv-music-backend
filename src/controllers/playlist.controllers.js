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
    } catch (error) {
        
    }
}