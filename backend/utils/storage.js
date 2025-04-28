import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, "insiden_" + "_" + file.originalname);
  },
});

// Create multer upload instance
export const upload = multer({ storage: storage });
