import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../libs/cloudinary.js";

export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id).select("-password");
    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });
    if (
      userFound.subscription.status === "premium" &&
      userFound.subscription.endDate
    ) {
      const now = new Date();
      const timeLeft = userFound.subscription.endDate - now;
      const minutesLeft = Math.floor(timeLeft / 1000 / 60);

      if (now > userFound.subscription.endDate) {
        userFound.subscription.status = "free";
        await userFound.save();
      } else if (minutesLeft <= 5 && minutesLeft > 0) {
        return res.json({
          ...userFound.toObject(),
          subscriptionAlert: {
            message: `Tu suscripción expira en ${minutesLeft} minuto(s)`,
            minutesLeft,
          },
        });
      }
    }

    res.json(userFound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, bio, password } = req.body;
    let avatarUrl;

    const updateData = { username, bio };

    if (password && password.trim() !== "") {
      const passwordHash = await bcrypt.hash(password, 10);
      updateData.password = passwordHash;
    }

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "avatars",
      });
      avatarUrl = result.secure_url;
      updateData.avatar = avatarUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userFound = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, userFound.password);
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
