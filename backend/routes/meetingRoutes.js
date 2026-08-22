const express = require("express");

const router = express.Router();

/*
AUTHENTICATION
*/

const authMiddleware = require("../middleware/authMiddleware.js");

/*
UPLOAD MIDDLEWARE
*/

const fileUpload = require("../config/multer");

const audioUpload = require("../middleware/audioUpload");

/*
MEETING CONTROLLER
*/

const {
  createMeeting,
  getMyMeetings,
  joinMeeting,
  getMeetingById,
  updateMeetingNotes,
  updateMeeting,
  deleteMeeting,
  saveNotetaker,
  getMeetingRecording,
} = require("../controllers/meetingController.js");

/*
AI CONTROLLER
*/

const {
  generateSummary,
  askMeetingAI,
} = require("../controllers/aiController.js");

/*
FILE CONTROLLER
*/

const {
  uploadMeetingFile,
  downloadMeetingFile,
  deleteMeetingFile,
} = require("../controllers/fileController.js");

/*
AUDIO CONTROLLER
*/

const { uploadAudio } = require("../controllers/audioController.js");

/*
MEETING CRUD
*/

// Create meeting
router.post("/", authMiddleware, createMeeting);

// Get user's meetings
router.get("/", authMiddleware, getMyMeetings);

/*
JOIN MEETING

IMPORTANT:
This route must come before /:id.
*/

router.post("/join", authMiddleware, joinMeeting);

/*
SINGLE MEETING
*/

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

/*
RECORDING
*/

// Generate temporary signed Backblaze B2 URL
router.get("/:id/recording", authMiddleware, getMeetingRecording);

/*
AI
*/

// Generate meeting summary
router.post("/:id/summary", authMiddleware, generateSummary);

// Ask AI about meeting
router.post("/:id/chat", authMiddleware, askMeetingAI);

/*
MEETING FILES
*/

// Upload file
router.post(
  "/:id/upload",

  authMiddleware,

  fileUpload.single("file"),

  uploadMeetingFile,
);

// Download file
router.get(
  "/:id/files/:fileId/download",

  authMiddleware,

  downloadMeetingFile,
);

// Delete file
router.delete(
  "/:id/files/:fileId",

  authMiddleware,

  deleteMeetingFile,
);

/*
MEETING AUDIO
*/

// Upload audio
router.post(
  "/:id/audio",

  authMiddleware,

  audioUpload.single("audio"),

  uploadAudio,
);

module.exports = router;
