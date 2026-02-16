import { createAccessToken } from "../libs/jwt.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../libs/cloudinary.js"; 

export const register = async (req, res) => {
  const { email, password, username, role } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role: role || "user",
    });
    const userSaved = await newUser.save();
    const token = await createAccessToken({
      id: userSaved._id,
      role: userSaved.role,
    });
    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
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
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });
    const token = await createAccessToken({
      id: userFound._id,
      role: userFound.role,
    });
    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      id: userFound.id,
      username: userFound.username,
      email: userFound.email,
      subscription: userSaved.subscription,
      role: userFound.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound)
    return res.status(400).json({ message: "Usuario no encontrado" });
  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    bio: userFound.bio, 
    avatar: userFound.avatar, 
    subscription: userFound.subscription,
  });
};
export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    let avatar;
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "avatars" },
        (error, result) => {
          if (error) throw error;
          return result;
        }
      );
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      const uploadResult = await uploadPromise;
      avatar = uploadResult.secure_url;
    }
    const updateData = { username, bio };
    if (avatar) updateData.avatar = avatar;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};