import jwt from "jsonwebtoken";
import User from "../controllers/models/userModel.js";

export const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging: Check what is in the token

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found." });
    }

    console.log("Authenticated User:", user); // Debugging: Check user details
    req.user = user; 
    next(); 
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(403).json({ message: "Invalid token." });
  }
};
