import { MONGODB_URI } from "./config.js";
import mongoose from "mongoose";
import Plan from "./models/plan.model.js";

export const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error(
        "La variable MONGODB_URI no está llegando desde config.js",
      );
    }
    await mongoose.connect(MONGODB_URI);
    console.log(">>> DB is connected to Wavv Music <<<");
    await seedPlans();
  } catch (error) {
    console.error("Error connecting to DB:", error.message);
  }
};

const seedPlans = async () => {
  try {
    const count = await Plan.countDocuments();
    if (count === 0) {
      await Plan.create([
        {
          name: "Premium",
          price: 6000,
          benefits: ["Playlist Ilimitada", "Sin anuncios", "Calidad superior"],
        },
      ]);
      console.log(">>> Solo se ha creado el Plan Premium <<<");
    }
  } catch (error) {
    console.error("Error al crear planes:", error.message);
  }
};