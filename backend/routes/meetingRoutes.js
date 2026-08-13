const express = require("express");
const router = express.Router();
const Upload = require("../config/multer");
const authMiddleware = require("../middleware/authMiddleware.js");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware.js");
// Controllers
const {
  createMeeting,
  getMyMeetings,
  joinMeeting,
  getMeetingById,
  updateMeetingNotes,
  updateMeeting,
  deleteMeeting,
  uploadMeetingAudio,
  saveNotetaker,
} = require("../controllers/meetingController.js");

const {
  generateSummary,
  askMeetingAI,
} = require("../controllers/aiController.js");

const { uploadMeetingFile } = require("../controllers/uploadController.js");

const { uploadAudio } = require("../controllers/audioController.js");

// Upload middlewares
const fileUpload = require("../config/multer");
const audioUpload = require("../middleware/audioUpload");

const {
  downloadMeetingFile,
  deleteMeetingFile,
} = require("../controllers/fileController");
// Meeting CRUD

router.post("/", authMiddleware, createMeeting);

router.get("/", authMiddleware, getMyMeetings);

router.get("/:id", authMiddleware, getMeetingById);

router.put("/:id", authMiddleware, updateMeeting);

router.delete("/:id", authMiddleware, deleteMeeting);

router.put("/:id/notes", authMiddleware, updateMeetingNotes);

router.put("/:id/notetaker", authMiddleware, saveNotetaker);

router.post("/join", authMiddleware, joinMeeting);

// AI

router.post("/:id/summary", authMiddleware, generateSummary);

router.post("/:id/chat", authMiddleware, askMeetingAI);

// File Upload

router.post(
  "/:id/upload",
  authMiddleware,
  fileUpload.single("file"),
  uploadMeetingFile,
);

router.post(
  "/:id/file",
  authMiddleware,
  fileUpload.single("file"),
  uploadMeetingFile,
);

// Audio Upload

router.post(
  "/:id/audio",
  authMiddleware,
  audioUpload.single("audio"),
  uploadAudio,
);

// Meeting Files

router.get("/:id/files/:fileId/download", authMiddleware, downloadMeetingFile);

router.delete("/:id/files/:fileId", authMiddleware, deleteMeetingFile);
module.exports = router;
