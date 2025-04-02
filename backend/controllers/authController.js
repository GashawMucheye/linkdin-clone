//register

import { generateTokenAndCookie } from '../config/generateTokenAndCookie.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const register = async (req, res) => {
  try {
    const { email, username, password, name } = req.body;
    if (!email || !username || !password || !name) {
      return res.status(400).json({
        msg: 'All fields are required',
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        msg: 'Password must be at least 6 characters long',
      });
    }
    if (!email.includes('@')) {
      return res.status(400).json({
        msg: 'Email is invalid',
      });
    }

    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        msg: 'Email Already exists',
      });
    }
    const newUser = await User.create({
      email,
      username,
      password: hashPassword,
      name,
    });

    // Generate a token and cookie for the user
    generateTokenAndCookie(newUser._id, res);
    res.status(200).json({
      msg: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Internal server error',
    });
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        msg: 'All fields are required',
      });
    }
    if (!email.includes('@')) {
      return res.status(400).json({
        msg: 'Email is invalid',
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: 'Invalid credentials',
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        msg: 'Invalid credentials',
      });
    }
    // Generate a token and cookie for the user
    generateTokenAndCookie(user._id, res);
    res.status(200).json({
      msg: 'User logged in successfully',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Internal server error',
    });
  }
};

//logout
const logout = async (req, res) => {
  try {
    res.clearCookie('jwt-Linkdin', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'logout success' });
  } catch (error) {
    res.status(500).json({ message: 'logout failed' });
  }
};

export { register, login, logout };
