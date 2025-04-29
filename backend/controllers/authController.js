// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import { defineMailOptions, transporter } from '../config/nodeMailer.js';
import { createWelcomeEmailTemplate } from '../emails/emailTemplates.js';

export const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  //
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 6 characters' });
  }

  if (await User.findOne({ email })) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  if (await User.findOne({ username })) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // 2) Hash & save
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  // 3) Issue JWT cookie
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });
  res.cookie('jwt-linkedin', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  // 4) Send response _before_ we attempt to send mail
  res.status(201).json({ message: 'User registered successfully' });

  // 5) Fire-and-forget email (errors are caught so they don’t trigger your errorHandler)
  const profileUrl = `${process.env.CLIENT_URL}/profile/${user.username}`;
  transporter
    .sendMail(
      defineMailOptions(
        user.email,
        'Welcome to LinkedIn',
        createWelcomeEmailTemplate(user.name, profileUrl)
      )
    )
    .then((info) => console.log('Welcome email sent:', info.response))
    .catch((err) => console.error('Error sending welcome email:', err));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });
  res.cookie('jwt-linkedin', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  res.json({ message: 'Logged in successfully' });
});

export const logout = (_, res) => {
  res.clearCookie('jwt-linkedin');
  res.json({ message: 'Logged out successfully' });
};

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});
