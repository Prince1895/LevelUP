import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import z from 'zod';

// Set cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // ensures cookies are only sent over HTTPS in production
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 1 day
};

// Register a new user
export const registerUser = async (req, res) => {
  const requirebodySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['student', 'instructor', 'admin']).optional()
  });

  const parsed = requirebodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Incorrect format credential",
      issues: parsed.error.issues,
    });
  }

  const { name, password, email, role = "student" } = parsed.data;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isApproved: role === "student",
      isBlocked: false
    });

    // Generate token and set cookie (optional after register)
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.cookie('token', token, cookieOptions);

    return res.status(201).json({
      message: "Signed up successfully" + (role === "instructor" ? ". Please wait for admin approval." : ""),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔐 Login a user
export const loginUser = async (req, res) => {
  const requirebodySchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  const parsed = requirebodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Incorrect format credential" });
  }

  const { email, password } = parsed.data;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role === "instructor" && !user.isApproved) {
      return res.status(403).json({ message: "Instructor account not approved by admin" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // 🍪 Set cookie
    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    // FIX: Changed req.user.id to req.user._id to match the structure set in authMiddleware
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Logout a user (clear cookie)
export const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};
