import { z } from "zod";

export const addSongSchema = z.object({
  body: z.object({
    songId: z.string().optional(),
    externalSong: z.object({
      title: z.string(),
      artist: z.string(),
      image: z.string(),
      youtubeUrl: z.string().optional(),
      duration: z.string().optional(),
    }).optional(),
  }).refine(
    (data) => data.songId || data.externalSong,
    {
      message: "Debe proporcionar songId o externalSong",
    }
  ),
});