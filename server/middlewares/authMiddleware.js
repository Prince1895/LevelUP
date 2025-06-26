import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  const Token = req.headers.authorization;
  if (!Token || !Token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = Token.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); 
    if(!user){
      return res.status(400).json({message:"User not found"});
    }
    req.user = {
      _id:user._id,
      role:user.role,
    }
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};