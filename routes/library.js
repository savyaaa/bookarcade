import express from "express";
import multer from "multer";
import {
  fetchBooks,
  getLikedBooks,
  likeBook,
  uploadBook,
} from "../controllers/libraryController.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "temp/my-uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/postbook",
  upload.fields([
    { name: "bookFile", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  verifyToken,
  uploadBook
);

router.get("/books", verifyToken, fetchBooks);
router.post("/books/:id/like", verifyToken, likeBook);
router.get("/likedbooks", verifyToken, getLikedBooks);

export default router;
