import express from "express";
import {
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;
