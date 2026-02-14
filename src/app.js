import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import songRoutes from "./routes/song.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);
app.use("/api", authRoutes);
app.use("/api", songRoutes);
app.use("/api", playlistRoutes);
app.use("/api/users", userRoutes);
export default app;
