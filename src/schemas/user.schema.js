import { z } from "zod";

export const updateUserSchema = z.object({
  username: z
    .string({ required_error: "El nombre de usuario es requerido" })
    .min(2, "El nombre de usuario debe tener al menos 2 caracteres")
    .max(30, "El nombre de usuario no puede tener más de 30 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guiones bajos"),
  email: z
    .string({ required_error: "El email es requerido" })
    .email("Email inválido")
    .max(50, "El email no puede tener más de 50 caracteres"),
  subscriptionStatus: z.enum(["free", "premium"]).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string({
    required_error: "La contraseña actual es obligatoria",
  }),
  newPassword: z
    .string({
      required_error: "La nueva contraseña es obligatoria",
    })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(20, "La contraseña no puede tener más de 20 caracteres")
    .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
    .regex(/[a-z]/, "Debe tener al menos una minúscula")
    .regex(/\d/, "Debe tener al menos un número")
    .regex(/[!@#$%^&*(),.?\":{}|_/]/, "Debe tener al menos un símbolo")
    .refine((val) => !/\s/.test(val), "La contraseña no puede contener espacios")
    .refine((val) => !/[<>]/.test(val), "La contraseña no puede contener < o >"),
});