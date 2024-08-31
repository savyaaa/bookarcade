import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// // Configuration
//     cloudinary.config({
//         cloud_name: 'dvfowitmb',
//         api_key: '693379755868545',
//         api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
//     });

// 0Xq4_J-g8lqcM7iMuX1DTOZCLTg
