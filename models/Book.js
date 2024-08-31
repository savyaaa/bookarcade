import mongoose from "mongoose";
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    format: {
      type: String,
      enum: ["pdf", "epub"],
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
