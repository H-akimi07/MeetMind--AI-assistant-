const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Make sure uploads directory exists
const uploadDirectory = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// Storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);

    const safeName =
      path
        .basename(file.originalname, extension)
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .substring(0, 80) || "meeting-file";

    cb(null, `${Date.now()}-${safeName}${extension}`);
  },
});

// Allowed files

const allowedMimeTypes = [
  // Documents
  "application/pdf",

  "application/msword",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "application/vnd.ms-excel",

  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  "application/vnd.ms-powerpoint",

  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Text
  "text/plain",

  "text/csv",

  // Images
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",

  // Audio
  "audio/mpeg",
  "audio/wav",
  "audio/mp3",
  "audio/webm",
];

// Multer

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Unsupported file type. Please upload PDF, DOCX, DOC, TXT, CSV, XLSX, PPTX, images, or supported audio files.",
      ),
    );
  },
});

module.exports = upload;
