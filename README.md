# TechX Mail Service

A robust email service that allows sending emails with attachments through a simple API interface.

## Project Structure

```
sendMail/
├── src/
│   ├── config/
│   │   ├── email.js     # Email configuration
│   │   └── swagger.js   # Swagger configuration
│   ├── middleware/
│   │   └── fileUpload.js # File upload handling
│   ├── routes/
│   │   └── emailRoutes.js # API routes
│   ├── services/
│   │   └── emailService.js # Email sending logic
│   └── utils/
│       └── validation.js   # Validation helpers
├── uploads/               # Temporary file storage
├── index.js              # Application entry point
├── swagger.json          # API documentation
└── package.json          # Project dependencies
```

## Features

- Send emails with attachments
- Support for HTML and plain text content
- File upload support (PDF, TXT, DOC, DOCX, JPG, PNG)
- Swagger documentation
- Environment-based configuration
- Automatic file cleanup
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
   ```

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

## Environment Configuration

The application supports two environments:

- Development (localhost:3000)
- Production (techxmail.onrender.com)

Environment-specific settings are automatically configured for:

- Swagger documentation
- API endpoints
- Security settings
