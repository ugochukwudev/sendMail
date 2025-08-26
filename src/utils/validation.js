const fs = require("fs");

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function cleanupFiles(files) {
  if (!files) return;
  files.forEach(file => {
    fs.unlink(file.path, (err) => {
      if (err) console.error(`Error deleting file ${file.path}:`, err);
    });
  });
}

module.exports = {
  isValidEmail,
  cleanupFiles
};
