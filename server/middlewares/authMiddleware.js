import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  // Look for the token in the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized - No token provided or token is invalid" });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by ID from the token payload
    const user = await User.findById(decoded.id).select('-password'); // Exclude password from the user object

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked." });
    }

    // This check is important for instructors
    if (user.role === "instructor" && !user.isApproved) {
      return res.status(403).json({ message: "Instructor account not yet approved by admin." });
    }

    // Attach the full user object to the request
    req.user = user; 

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
