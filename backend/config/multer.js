import multer from "multer";
import path from "path";

// Define allowed image file types
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Default upload folder
    let folder = "./uploads";


    if (req.baseUrl.includes("/blog")) {
      folder = "../user/public/profileImages";
    }

    callback(null, folder);
  },
  filename: (req, file, callback) => {
    // Extract file extension and create a unique filename
    const ext = path.extname(file.originalname);
    callback(null, Date.now() + ext);
  },
});

// File type validation
const fileFilter = (req, file, callback) => {
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error("Invalid file type. Only JPG, PNG, and JPEG are allowed."),
      false
    );
  }
};

// Initialize Multer with configured storage and file filter
const upload = multer({ storage, fileFilter });

export default upload;
