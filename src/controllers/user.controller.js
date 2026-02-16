import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../libs/cloudinary.js";

export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id).select("-password");
    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(userFound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    let avatarUrl;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "avatars",
      });
      avatarUrl = result.secure_url;
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          username,
          bio,
          avatar: avatarUrl,
        },
        { new: true }
      ).select("-password");
      return res.json(updatedUser);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        username,
        bio,
      },
      { new: true }
    ).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userFound = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(
      currentPassword,
      userFound.password
    );
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    const passwordHash = await bcrypt.hash(newPassword, 10);
    userFound.password = passwordHash;
    await userFound.save();
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
