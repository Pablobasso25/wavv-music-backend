import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({ required_error: "El nombre de usuario es requerido" })
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  email: z
    .string({ required_error: "El email es requerido" })
    .email("Email inválido"),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(8, "La contraseña debe tener al menos 8 caracteres") // Subimos a 8
    .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
    .regex(/[a-z]/, "Debe tener al menos una minúscula")
    .regex(/\d/, "Debe tener al menos un número")
    .regex(/[!@#$%^&*(),.?":{}|_/<>]/, "Debe tener al menos un símbolo"),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});
