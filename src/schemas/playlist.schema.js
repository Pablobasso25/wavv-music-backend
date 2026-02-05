import { z } from "zod";

export const addSongSchema = z.object({
  songId: z.string({
    required_error: "El ID de la canción es requerido",
  }).min(1, "El ID no puede estar vacío"),
});