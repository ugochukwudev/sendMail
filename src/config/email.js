const nodemailer = require("nodemailer");

const emailConfig = {
  service: "gmail",
  auth: {
    user: "managetechx@gmail.com",
    pass: process.env.pass,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

module.exports = {
  transporter,
  defaultFrom: "Techx Mail Service"
};
