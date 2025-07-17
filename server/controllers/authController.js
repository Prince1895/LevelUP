import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import z from 'zod';

// 📌 Register a new user
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
      isApproved: role === "student",   // ✅ Students auto-approved
      isBlocked: false
    });

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

// Login a user
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

    // 🔐 Instructor approval check
    if (user.role === "instructor" && !user.isApproved) {
      return res.status(403).json({ message: "Instructor account not approved by admin" });
    }

    // 🔒 Blocked user check
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    return res.status(200).json({
      message: "Logged in successfully",
      token,
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
