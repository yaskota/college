import nodemailer  from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.NODE_MAIL_HOST,
  port: 587,
  // secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.NODE_MAIL_USERNAME,
    pass: process.env.NODE_MAIL_PASSWORD, 
  },
});


export default transporter;