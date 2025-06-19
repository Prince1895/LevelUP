import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import z from 'zod';

// Register a new user


export const registerUser = async (req, res) => {
  const requirebodySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['student', 'instructor', 'admin']).optional(),
    avatar: z.string().optional(),
  });

  const parsed = requirebodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "incorrect format credential",
      issues: parsed.error.issues,
    });
  }

  const { name, password, email, role = "student", avatar = "" } = parsed.data;

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
      avatar,
    });

    return res.status(201).json({
      message: "Signed up successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login a user
export const loginUser = async (req, res) => {
}
