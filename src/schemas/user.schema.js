import { z } from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z.string({
    required_error: "La contraseña actual es obligatoria",
  }),
  newPassword: z
    .string({
      required_error: "La nueva contraseña es obligatoria",
    })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
    .regex(/[a-z]/, "Debe tener al menos una minúscula")
    .regex(/\d/, "Debe tener al menos un número")
    .regex(/[!@#$%^&*(),.?\":{}|_/<>]/, "Debe tener al menos un símbolo"),
});  