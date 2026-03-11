import { z } from "zod";

export const createPreferenceSchema = z.object({
  planType: z.enum(["Premium", "Familiar", "premium", "familiar"], {
    required_error: "El tipo de plan es obligatorio",
    invalid_type_error: "El plan debe ser Premium o Familiar",
  }),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "El precio debe ser un número válido mayor a 0",
    }),
});