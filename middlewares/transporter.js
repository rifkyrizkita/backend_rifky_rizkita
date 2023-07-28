const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_TRANSPORTER,
    pass: process.env.PASS_TRANSPORTER,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
module.exports = transporter;
