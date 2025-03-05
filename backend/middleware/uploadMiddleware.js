import multer from "multer";
import path from "path";

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadsCV/"); // Store in uploadsCV folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only PDF and Word files are allowed"), false);
  }
  cb(null, true);
};

// Export the Multer Configuration
export const uploadsCV = multer({ storage, fileFilter });
