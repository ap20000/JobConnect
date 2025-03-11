import multer from "multer";
import path from "path";

// Define allowed file types for both image and CV
const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
const allowedCVTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let folder = "./uploads"; // Default folder for images
    if (file.mimetype && allowedCVTypes.includes(file.mimetype)) {
      folder = "./uploadsCV"; // Folder for CVs
    }
    callback(null, folder);
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    callback(null, Date.now() + ext);
  },
});

// File type validation
const fileFilter = (req, file, callback) => {
  if (allowedImageTypes.includes(file.mimetype) || allowedCVTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Invalid file type. Only JPG, PNG, JPEG, PDF, and Word files are allowed."), false);
  }
};

// Initialize Multer with configured storage and file filter
const upload = multer({ storage, fileFilter });

export default upload;
