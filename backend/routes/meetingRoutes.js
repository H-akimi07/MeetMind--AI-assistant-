const express = require("express");
const router = express.Router();
const Upload = require("../config/multer");
const authMiddleware = require("../middleware/authMiddleware.js");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");
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
} = require("../controllers/meetingController.js");

const {
  generateSummary,
  askMeetingAI,
} = require("../controllers/aiController");

const { uploadMeetingFile } = require("../controllers/uploadController");

const { uploadAudio } = require("../controllers/audioController");

// Upload middlewares
const fileUpload = require("../config/multer");
const audioUpload = require("../middleware/audioUpload");

// ============================
// Meeting CRUD
// ============================

router.post("/", authMiddleware, createMeeting);

router.get("/", authMiddleware, getMyMeetings);

router.get("/:id", authMiddleware, getMeetingById);

router.put("/:id", authMiddleware, updateMeeting);

router.delete("/:id", authMiddleware, deleteMeeting);

router.put("/:id/notes", authMiddleware, updateMeetingNotes);

router.post("/join", authMiddleware, joinMeeting);

// ============================
// AI
// ============================

router.post("/:id/summary", authMiddleware, generateSummary);

router.post("/:id/chat", authMiddleware, askMeetingAI);

// ============================
// File Upload
// ============================

router.post("/:id/upload", fileUpload.single("file"), uploadMeetingFile);
router.post("/:id/file", fileUpload.single("file"), uploadMeetingFile);

// ============================
// Audio Upload
// ============================

router.post(
  "/:id/audio",
  authMiddleware,
  audioUpload.single("audio"),
  uploadAudio,
);

module.exports = router;
