import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

// Create a transporter
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD, // Be careful with this (consider using environment variables)
  },
  tls: {
    rejectUnauthorized: false, // This ignores self-signed certificate errors
  },
});

// Define mail options
export const defineMailOptions = (to, subject, html) => ({
  from: process.env.NODEMAILER_EMAIL,
  to,
  subject,
  html,
});
