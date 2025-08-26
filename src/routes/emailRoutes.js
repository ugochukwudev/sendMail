const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileUpload');
const { isValidEmail } = require('../utils/validation');
const { sendEmail } = require('../services/emailService');

// Health check route
router.get("/health", (req, res) => {
  res.status(200).send("sendmail backend is up and running");
});

// Welcome route
router.get("/", (req, res) => {
  res.status(200).send(`<h1>Welcome to techxmail</h1>`);
});

// Send email route
router.post("/sendmail", upload.array('attachments', 5), async (req, res) => {
  console.log('=== REQUEST RECEIVED ===');
  const { mail, subject, text, html, name } = req.body;

  // Validate email format
  if (!isValidEmail(mail)) {
    res.status(400).send({ message: "Invalid email format" });
    return;
  }

  // Validate required fields
  if (!mail || !subject || !name) {
    res.status(400).send({ message: "Incomplete data" });
    return;
  }

  try {
    const result = await sendEmail({
      mail,
      subject,
      text,
      html,
      files: req.files
    });
    res.status(200).send({ message: "Email sent successfully" });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).send({ message: error.message });
  }
});

// Catch-all route
router.get("*", (req, res) => {
  res.status(404).send(`<b>Not found</b>`);
});

module.exports = router;
