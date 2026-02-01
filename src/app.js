import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
/* import payRoutes from "./routes/payments.routes.js" */
//ejecuto e inicializo express el cual me devuelve un objeto que lo guardo en una variable
// app es el servidor
const app = express();

app.use(morgan("dev"));
app.use(express.json()); //Para que el servidor entienda los datos JSON que manda el front
app.use(cookieParser()); // Le digo a Express que ahora puede entender las cookies que vienen del navegador
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // La URL del frontend de React
    credentials: true, // Para que permita el envío de cookies
  }),
);

export default app;
