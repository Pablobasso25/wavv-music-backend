import { createAccessToken } from "../libs/jwt.js";
import User from "../models/user.model.js";
import { sendEmail } from "./email.controller.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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
    
    try {
      await sendEmail({
        to_name: userSaved.username,
        to_email: userSaved.email,
        asunto_dinamico: "¡Bienvenido a Wavv Music!",
        cuerpo_mensaje: `Gracias por unirte a Wavv Music. Ahora puedes disfrutar de miles de canciones. ¡Comienza a escuchar!`,
      });
    } catch (emailError) {
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
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // IMPORTANTE: no revelar si existe o no
    if (!user) {
      return res.json({ message: "Si el email existe, se envió un link" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendEmail({
      to_name: user.username,
      to_email: user.email,
      asunto_dinamico: "Recuperar contraseña",
      cuerpo_mensaje: `Haz click aquí para restablecer tu contraseña: ${resetLink}`,
    });

    res.json({ message: "Si el email existe, se envió un link" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};