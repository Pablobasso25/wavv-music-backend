import { z } from "zod";

export const updatePlanSchema = z.object({
  name: z.string().min(2, "El nombre del plan debe tener al menos 2 caracteres"),
  price: z
    .number({ required_error: "El precio es requerido", invalid_type_error: "El precio debe ser un número" })
    .nonnegative("El precio no puede ser negativo")
    .max(1000000, "El precio máximo permitido es $1.000.000"),
  benefits: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  adInterval: z
    .number({ required_error: "El intervalo es requerido", invalid_type_error: "El intervalo debe ser un número" })
    .nonnegative("El intervalo no puede ser negativo")
    .max(50, "El intervalo máximo permitido es de 50"),
  playlistLimit: z
    .number({ required_error: "El límite es requerido", invalid_type_error: "El límite debe ser un número" })
    .positive("El límite de canciones debe ser mayor a 0")
    .max(10000, "El límite máximo permitido es de 10.000 canciones"),
});