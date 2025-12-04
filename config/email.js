const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth:{
//         user: process.env.EMAIL_HOST_USER,
//         pass: process.env.EMAIL_HOST_PASSWORD,
//     },
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD,
  },
});


module.exports = { transporter };