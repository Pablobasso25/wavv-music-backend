import Song from "../models/song.model.js"

export const getSongs = async (req, res) => {
    try {
        const songs = await Song.find().populate("user", "username");
        res.json(songs);
    } catch (error) {
        return res.status(500).json({message: "Error al obtener canciones"})
    }
}

export const createSong = async (req, res) => {
    try {
        const {title, artist, image, youtubeUrl, duration} = req.body;
        const newSong = new Song({
            title,
            artist,
            image,
            youtubeUrl,
            duration,
            user: req.user.id
        });
        const savedSong = await newSong.save(); 
        res.status(201).json(savedSong);
    } catch (error) {
        return res.status(500).json({message: "Error al guardar la cancion"})
    }
}

export const searchExternalSongs =  async (req, res) => {
    const {search} = req.query;

    if (!search) {
        return res.status(400).json({message: "Se requiere un término de búsqueda"})
    }
}