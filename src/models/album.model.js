import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    collectionId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    artistName: { type: String, required: true },
    image: { type: String },
    tracks: [
      {
        trackId: { type: String },
        name: { type: String },
        duration_ms: { type: Number },
        preview_url: { type: String },
        cover: { type: String },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Album", albumSchema);