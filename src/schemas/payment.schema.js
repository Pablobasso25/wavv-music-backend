import { z } from "zod";

export const createPreferenceSchema = z.object({
  planType: z.enum(["Premium", "Familiar"], {
    required_error: "El tipo de plan es obligatorio",
    invalid_type_error: "El plan debe ser Premium o Familiar",
  }),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 6000, {
      message: "El precio debe ser un número mayor o igual a $6000",
    }),
});
