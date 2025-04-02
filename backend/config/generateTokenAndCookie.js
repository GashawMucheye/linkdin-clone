//generate a token and cookie for the user
import jwt from 'jsonwebtoken';

export const generateTokenAndCookie = (userId, res) => {
  // Generate a token
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  // Set the cookie options
  const options = {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
    sameSite: 'strict', // Prevent CSRF attacks
  };
  // Set the cookie in the response
  res.cookie('jwt-Linkdin', token, options);
};
