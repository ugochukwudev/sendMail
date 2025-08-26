# TechX Mail Service

A robust email service that allows sending emails with attachments through a simple API interface.

## Project Structure

```
sendMail/
├── src/
│   ├── config/
│   │   ├── email.js      # Email configuration
│   │   ├── cloudinary.js # Cloudinary configuration
│   │   └── swagger.js    # Swagger configuration
│   ├── middleware/
│   │   └── fileUpload.js # File upload handling
│   ├── routes/
│   │   └── emailRoutes.js # API routes
│   ├── services/
│   │   └── emailService.js # Email sending logic
│   └── utils/
│       └── validation.js   # Validation helpers
├── index.js              # Application entry point
├── swagger.json          # API documentation
└── package.json          # Project dependencies
```

## Features

- Send emails with attachments
- Support for HTML and plain text content
- Cloud-based file handling with Cloudinary
- File upload support (PDF, TXT, DOC, DOCX, JPG, PNG)
- Automatic file cleanup (files are deleted after 1 hour)
- Swagger documentation
- Environment-based configuration
- Health monitoring

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a .env file with:

   ```
   pass=your_gmail_app_password
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   You can get Cloudinary credentials by:

   1. Sign up at https://cloudinary.com/ (free tier)
   2. Go to your dashboard
   3. Copy the credentials

3. Start the server:

   ```bash
   # Development
   npm run dev

   # Production
   NODE_ENV=production npm start
   ```

## API Documentation

Access the Swagger documentation at:

- Development: http://localhost:3000/api-docs
- Production: https://techxmail.onrender.com/api-docs

## API Endpoints

### POST /sendmail

Send an email with optional attachments.

Required fields:

- name: Sender name
- mail: Recipient email
- subject: Email subject
- text or html: Email content

Optional:

- attachments: Up to 5 files (5MB max each)

## File Support

Supported file types:

- PDF (.pdf)
- Text files (.txt)
- Word documents (.doc, .docx)
- Images (.jpg, .png)

Files are:

- Uploaded to Cloudinary
- Available via secure URLs in emails
- Automatically deleted after 1 hour
- Limited to 5MB each
- Maximum 5 files per email

## Environment Configuration

The application supports two environments:

- Development (localhost:3000)
- Production (techxmail.onrender.com)

Environment-specific settings are automatically configured for:

- Swagger documentation
- API endpoints
- Security settings
