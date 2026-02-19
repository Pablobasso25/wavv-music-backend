import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const initializeAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      const admin = new User({
        username: "Admin",
        email: adminEmail,
        password: passwordHash,
        role: "admin",
        subscription: {
          status: "admin",
        },
      });

      await admin.save();
    }
  } catch (error) {
    console.error("Error creando admin:", error.message);
  }
};