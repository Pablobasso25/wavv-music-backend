import { MONGODB_URI } from "./config.js";

export const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error(
        "La variable MONGODB_URI no está llegando desde config.js",
      );
    }
    await mongoose.connect(MONGODB_URI);

    console.log(">>> DB is connected to Wavv Music <<<");
  } catch (error) {
    console.error("Error connecting to DB:", error.message);
  }
};
