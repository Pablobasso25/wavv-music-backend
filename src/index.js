// Importo app desde app.js - es la instancia de Express ya configurada
import app from "./app.js";
// Importo connectDB desde db.js - es la función que conecta a MongoDB Atlas
import { connectDB } from "./db.js";
// Importo PORT desde config.js - contiene el número de puerto (del .env o 4001 por defecto)
import { PORT } from "./config.js";

// Primero me conecto a la base de datos antes de iniciar el servidor
connectDB();

// Le digo a Express que escuche peticiones HTTP en el puerto especificado (4000)
// app.listen() inicia el servidor web
app.listen(PORT);
// Muestro en consola en qué puerto está corriendo el servidor
console.log("Server on port", PORT);
