import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
      unique: true, 
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song", 
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Playlist", playlistSchema);