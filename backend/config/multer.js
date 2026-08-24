const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(process.cwd(), "uploads");

// Make sure uploads directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);

    cb(null, `${Date.now()}${extension}`);
  },
});

const allowedMimeTypes = [
  "application/pdf",

  "application/msword",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "text/plain",

  "text/csv",

  "application/rtf",

  "text/rtf",

  "application/vnd.ms-excel",

  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  "application/vnd.ms-powerpoint",

  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  "image/png",

  "image/jpeg",

  "image/jpg",

  "image/webp",

  "audio/mpeg",

  "audio/wav",

  "audio/webm",
];

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: function (req, file, cb) {
    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(new Error(`Unsupported file type: ${file.mimetype}`));
  },
});

module.exports = upload;
