import cloudinary from "../config/cloudinary.js";
import Book from "../models/Book.js";
import fs from "fs";
import User from "../models/User.js";
export const uploadBook = async (req, res) => {
  const { title, author, format } = req.body;
  const bookFile = req.files["bookFile"][0];
  const coverImage = req.files["coverImage"]
    ? req.files["coverImage"][0]
    : null;
  try {
    // Upload book file to Cloudinary
    const bookUploadResult = await cloudinary.uploader.upload(bookFile.path, {
      // unique_filename: false,
      use_filename: true,
      resource_type: "raw",
      folder: "books",
    });

    // Upload cover image to Cloudinary (if provided)
    let coverImageUrl = "";
    if (coverImage) {
      const coverUploadResult = await cloudinary.uploader.upload(
        coverImage.path,
        {
          resource_type: "auto",
          folder: "book_covers",
        }
      );
      coverImageUrl = coverUploadResult.url;
    }

    // Create new book document
    const newBook = new Book({
      title,
      author,
      format,
      fileUrl: bookUploadResult.url,
      coverImageUrl,
    });

    await newBook.save();
    res.redirect("/library");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading book");
  } finally {
    // Always delete uploaded files from the server
    try {
      fs.unlinkSync(bookFile.path);
      if (coverImage) fs.unlinkSync(coverImage.path);
    } catch (unlinkError) {
      console.error("Error deleting temporary files", unlinkError);
    }
  }
};

export const fetchBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const books = await Book.find();

    // Add a isLiked property to each book based on user's likedBooks
    const booksWithLikeStatus = books.map((book) => ({
      ...book.toObject(),
      isLiked: user.likedBooks.includes(book._id),
    }));

    res.json(booksWithLikeStatus);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const likeBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id; // Assuming you're using Passport.js or similar for authentication
    const { isLiked } = req.body;

    // Find the book and update its isLiked status
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { isLiked: isLiked },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Update user's likedBooks array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isLiked) {
      // Add book to likedBooks if not already present
      if (!user.likedBooks.includes(bookId)) {
        user.likedBooks.push(bookId);
      }
    } else {
      // Remove book from likedBooks
      user.likedBooks = user.likedBooks.filter(
        (id) => id.toString() !== bookId
      );
    }

    await user.save();

    res.json({
      message: "Book and user updated successfully",
      book: updatedBook,
      userLikedBooks: user.likedBooks,
    });
  } catch (error) {
    console.error("Error updating book and user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLikedBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const foundUser = await User.findById(userId);

    // Use Promise.all to resolve all promises in parallel
    const foundBooks = await Promise.all(
      foundUser.likedBooks.map(async (likedBook) => {
        const foundBook = await Book.findById(likedBook);
        return foundBook;
      })
    );

    res.json(foundBooks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving liked books.");
  }
};
