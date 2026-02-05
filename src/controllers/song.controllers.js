import Song from "../models/song.model.js"

export const getSongs = async (req, res) => {
    try {
        const songs = await Song.find().populate("user", "username");
        res.json(songs);
    } catch (error) {
        return res.status(500).json({message: "Error al obtener canciones"})
    }
}