const multer = require("multer");
const path = require("path");
const fs = require("fs");

// MAKE SURE UPLOADS FOLDER EXISTS

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// STORAGE

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);

    const safeName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + extension;

    cb(null, safeName);
  },
});

// ALLOWED FILE TYPES

const allowedMimeTypes = [
  // PDF
  "application/pdf",

  // Microsoft Word
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Text
  "text/plain",

  // Optional common document types
  "application/rtf",

  // Images
  "image/png",
  "image/jpeg",
  "image/jpg",
];

// MULTER

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Unsupported file type. Please upload PDF, DOCX, DOC, TXT, RTF, JPG, JPEG, or PNG files.",
        ),
      );
    }
  },
});

module.exports = upload;
