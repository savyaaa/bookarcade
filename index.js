import express from "express";
import path from "path";
import url from "url";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import libRoutes from "./routes/library.js";
import { connectToDB } from "./config/db.js";
import { verifyToken } from "./middleware/verifyToken.js";
import User from "./models/User.js";
dotenv.config();

const app = express();

// Get the directory name of the current module
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the view engine to EJS
app.set("view engine", "ejs");

// Set the directory for serving static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Define a route to render the index.ejs file

app.get("/", async (req, res) => {
  let foundUser = null;
  if (req.cookies.token) {
    try {
      const decodedToken = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET
      );
      foundUser = await User.findById(decodedToken.id);
    } catch (err) {
      console.log("Error verifying token:", err.message);
    }
  }
  res.render("pages/home", { foundUser });
});

app.get("/signup", async (req, res) => {
  let foundUser = null;
  if (req.cookies.token) {
    try {
      const decodedToken = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET
      );
      foundUser = await User.findById(decodedToken.id);
    } catch (err) {
      console.log("Error verifying token:", err.message);
    }
  }
  res.render("pages/signup", { foundUser });
});

app.get("/login", async (req, res) => {
  let foundUser = null;
  if (req.cookies.token) {
    try {
      const decodedToken = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET
      );
      foundUser = await User.findById(decodedToken.id);
    } catch (err) {
      console.log("Error verifying token:", err.message);
    }
  }
  res.render("pages/login", { foundUser });
});

app.get("/library", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const foundUser = await User.findById(userId);
  res.render("pages/library", { foundUser });
});

app.get("/postbook", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const foundUser = await User.findById(userId);
  res.render("pages/postbook", { foundUser });
});

app.get("/booklist", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const foundUser = await User.findById(userId);
  res.render("pages/booklist", { foundUser });
});

app.use("/api/auth", authRoutes);
app.use("/api/library", libRoutes);

app.use((req, res, next) => {
  res.status(404).render("pages/404");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
