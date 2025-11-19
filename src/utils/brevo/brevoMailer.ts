import nodemailer from "nodemailer";

export const brevoTransporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: 587,
  secure: false, // False for port 587
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});
