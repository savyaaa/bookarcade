import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    likedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", // Reference to a Book model
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
