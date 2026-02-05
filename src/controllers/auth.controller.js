import { createAccessToken } from "../libs/jwt.js";
import userModel from "../models/user.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

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
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

try {
  const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: "Ususario no encontrado"});
} catch (error) {
  
}
}

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
  maxAge: 24  * 60 * 60 * 1000,
});




