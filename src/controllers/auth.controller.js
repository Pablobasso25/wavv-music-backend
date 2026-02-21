import { createAccessToken } from "../libs/jwt.js";
import User from "../models/user.model.js";
import { sendEmail } from "./email.controller.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { email, password, username, role } = req.body;
  try {
    if (role === "admin") {
      const adminExists = await User.findOne({ role: "admin" });
      if (adminExists) {
        return res
          .status(400)
          .json(["Ya existe un administrador en el sistema"]);
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role: role || "user",
    });
    const userSaved = await newUser.save();
    
    console.log("👤 Usuario guardado, enviando email...");
    
    try {
      await sendEmail({
        to_name: userSaved.username,
        to_email: userSaved.email,
        asunto_dinamico: "¡Bienvenido a Wavv Music!",
        cuerpo_mensaje: `Gracias por unirte a Wavv Music. Ahora puedes disfrutar de miles de canciones. ¡Comienza a escuchar!`,
      });
    } catch (emailError) {
      console.error("❌ Error enviando email de bienvenida:", emailError);
    }
    
    const token = await createAccessToken({
      id: userSaved._id,
      role: userSaved.role,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      subscription: userSaved.subscription,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
      role: userSaved.role,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json(["El email ya está registrado"]);
    }
    return res.status(500).json([error.message]);
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: "Ususario no encontrado" });
    if (userFound.isActive === false) {
      return res
        .status(403)
        .json({ message: "Usuario dado de baja. Contacta al administrador." });
    }
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });
    const token = await createAccessToken({
      id: userFound._id,
      role: userFound.role,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      id: userFound.id,
      username: userFound.username,
      email: userFound.email,
      subscription: userFound.subscription,
      role: userFound.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res.sendStatus(200);
};
