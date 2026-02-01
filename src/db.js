// Importo mongoose desde el paquete "mongoose" - es como un traductor que convierte objetos JavaScript en documentos de MongoDB y viceversa.
import mongoose from "mongoose";
// Importo MONGODB_URI desde config.js - contiene la URL de conexión a MongoDB Atlas
import { MONGODB_URI } from "./config.js";

// Esta función asíncrona se encarga de conectar la aplicación a la base de datos MongoDB
// Se exporta para ser llamada desde index.js cuando inicia la aplicación
export const connectDB = async () => {
  try {
    // Verificamos que la URI exista antes de intentar conectar
    if (!MONGODB_URI) {
      throw new Error(
        "La variable MONGODB_URI no está llegando desde config.js",
      );
    }

    // Usamos la variable importada
    await mongoose.connect(MONGODB_URI);

    console.log(">>> DB is connected to Wavv Music <<<");
  } catch (error) {
    // Si falla, el log nos dirá exactamente por qué (ej: error de contraseña)
    console.error("Error connecting to DB:", error.message);
  }
};
