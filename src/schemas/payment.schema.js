import { z } from "zod";

export const createPreferenceSchema = z.object({
  planId: z
    .string({
      required_error: "El ID del plan es obligatorio",
    })
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: "El ID del plan no es válido",
    }),
});