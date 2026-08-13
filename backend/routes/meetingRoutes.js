const express = require("express");
const router = express.Router();

// Authentication
const authMiddleware = require("../middleware/authMiddleware.js");

// Upload middleware
const fileUpload = require("../config/multer");
const audioUpload = require("../middleware/audioUpload");

// Meeting Controller
const {
  createMeeting,
  getMyMeetings,
  joinMeeting,
  getMeetingById,
  updateMeetingNotes,
  updateMeeting,
  deleteMeeting,
  saveNotetaker,
} = require("../controllers/meetingController.js");

// AI Controller
const {
  generateSummary,
  askMeetingAI,
} = require("../controllers/aiController.js");

// File Controller
const {
  uploadMeetingFile,
  downloadMeetingFile,
  deleteMeetingFile,
} = require("../controllers/fileController.js");

// Audio Controller
const { uploadAudio } = require("../controllers/audioController.js");

/*  MEETING CRUD  */

// Create meeting
router.post("/", authMiddleware, createMeeting);

// Get user's meetings
router.get("/", authMiddleware, getMyMeetings);

// Get single meeting
router.get("/:id", authMiddleware, getMeetingById);

// Update meeting
router.put("/:id", authMiddleware, updateMeeting);

// Delete meeting
router.delete("/:id", authMiddleware, deleteMeeting);

// Update notes
router.put("/:id/notes", authMiddleware, updateMeetingNotes);

// Save Nylas Notetaker ID
router.put("/:id/notetaker", authMiddleware, saveNotetaker);

// Join meeting
router.post("/join", authMiddleware, joinMeeting);

/* AI  */

// Generate meeting summary
router.post("/:id/summary", authMiddleware, generateSummary);

// Ask AI about meeting
router.post("/:id/chat", authMiddleware, askMeetingAI);

/* MEETING FILES  */

// Upload file
router.post(
  "/:id/upload",
  authMiddleware,
  fileUpload.single("file"),
  uploadMeetingFile,
);

// Download file
router.get("/:id/files/:fileId/download", authMiddleware, downloadMeetingFile);

// Delete file
router.delete("/:id/files/:fileId", authMiddleware, deleteMeetingFile);

/*  MEETING AUDIO  */

// Upload audio
router.post(
  "/:id/audio",
  authMiddleware,
  audioUpload.single("audio"),
  uploadAudio,
);

module.exports = router;
