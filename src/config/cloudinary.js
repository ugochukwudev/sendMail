const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file buffer to Cloudinary
const uploadBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: 'temp_emails',
        resource_type: 'auto',
        // Set to private to require signed URLs
        type: 'private',
        // Delete the file after 1 hour
        invalidate: true,
        transformation: [{
          duration: 3600 // 1 hour in seconds
        }]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });
};

module.exports = {
  uploadBuffer,
  cloudinary
};