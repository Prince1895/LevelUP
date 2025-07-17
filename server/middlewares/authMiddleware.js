import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  const Token = req.headers.authorization;

  if (!Token || !Token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  const token = Token.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔒 Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked." });
    }

    // ❌ Optional: Prevent unapproved instructors from accessing instructor routes
    if (user.role === "instructor" && user.isApproved === false) {
      return res.status(403).json({ message: "Instructor account not yet approved by admin." });
    }

    req.user = {
      _id: user._id,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
