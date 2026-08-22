const generateMeetingAI = require("../services/openaiService");
const Meeting = require("../models/Meeting");
const crypto = require("crypto");

const { getSignedB2RecordingUrl } = require("../services/b2Service");

/*
CREATE MEETING
*/

const createMeeting = async (req, res) => {
  try {
    const { title, description, scheduledAt, duration, status, meetingUrl } =
      req.body;

    console.log("CREATE MEETING BODY:", req.body);
    console.log("CURRENT USER:", req.user);

    if (!title || !scheduledAt) {
      return res.status(400).json({
        message: "Title and scheduled date are required",
      });
    }

    const meeting = await Meeting.create({
      title,

      description: description || "",

      scheduledAt,

      duration: Number(duration) || 60,

      status: status || "scheduled",

      meetingUrl: meetingUrl || "",

      organizer: req.user.id,

      participants: [req.user.id],

      meetingCode: crypto.randomUUID(),
    });

    console.log("MEETING CREATED:", meeting._id);

    res.status(201).json({
      message: "Meeting created successfully",

      meeting,
    });
  } catch (error) {
    console.error("CREATE MEETING ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
GET ALL MEETINGS OF LOGGED-IN USER
*/

const getMyMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      organizer: req.user.id,
    })
      .populate("participants", "fullName email")
      .sort({ scheduledAt: 1 });

    res.status(200).json(meetings);
  } catch (error) {
    console.error("GET MY MEETINGS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
JOIN MEETING
*/

const joinMeeting = async (req, res) => {
  try {
    const { meetingCode } = req.body;

    if (!meetingCode) {
      return res.status(400).json({
        message: "Meeting code is required",
      });
    }

    const meeting = await Meeting.findOne({
      meetingCode,
    });

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    const alreadyParticipant = meeting.participants.some(
      (participant) => participant.toString() === req.user.id.toString(),
    );

    if (!alreadyParticipant) {
      meeting.participants.push(req.user.id);

      await meeting.save();
    }

    res.json({
      message: "Joined meeting successfully",

      meeting,
    });
  } catch (error) {
    console.error("JOIN MEETING ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
GET MEETING BY ID
*/

const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("organizer", "fullName email")
      .populate("participants", "fullName email");

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    const userId = req.user.id.toString();

    const organizerId = meeting.organizer?._id?.toString();

    const isParticipant = meeting.participants.some(
      (participant) => participant._id?.toString() === userId,
    );

    if (organizerId !== userId && !isParticipant) {
      return res.status(403).json({
        message: "You do not have access to this meeting",
      });
    }

    res.json(meeting);
  } catch (error) {
    console.error("GET MEETING ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
UPDATE MEETING NOTES
*/

const updateMeetingNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    const meeting = await Meeting.findOneAndUpdate(
      {
        _id: req.params.id,

        organizer: req.user.id,
      },

      {
        notes: notes || "",
      },

      {
        new: true,
      },
    );

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    res.json(meeting);
  } catch (error) {
    console.error("UPDATE NOTES ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
UPDATE MEETING
*/

const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndUpdate(
      {
        _id: req.params.id,

        organizer: req.user.id,
      },

      {
        title: req.body.title,

        description: req.body.description,

        scheduledAt: req.body.scheduledAt,

        duration: req.body.duration,

        status: req.body.status,

        meetingUrl: req.body.meetingUrl,
      },

      {
        new: true,

        runValidators: true,
      },
    );

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    res.json(meeting);
  } catch (error) {
    console.error("UPDATE MEETING ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
GENERATE SUMMARY
*/

const generateSummary = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    const userId = req.user.id.toString();

    if (meeting.organizer.toString() !== userId) {
      return res.status(403).json({
        message: "You do not have access to this meeting",
      });
    }

    const sourceText =
      meeting.transcript || meeting.notes || meeting.fileContents || "";

    if (!sourceText.trim()) {
      return res.status(400).json({
        message: "There are no notes or transcript available for AI summary",
      });
    }

    const aiResult = await generateMeetingAI(sourceText);

    meeting.summary = aiResult.summary || "";

    meeting.actionItems = Array.isArray(aiResult.actionItems)
      ? aiResult.actionItems
      : [];

    await meeting.save();

    res.json({
      message: "AI Summary Generated",

      meeting,
    });
  } catch (error) {
    console.error("GENERATE SUMMARY ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
DELETE MEETING
*/

const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      _id: req.params.id,

      organizer: req.user.id,
    });

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    await meeting.deleteOne();

    res.json({
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    console.error("DELETE MEETING ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
UPLOAD FILE
*/

const uploadFile = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      _id: req.params.id,

      organizer: req.user.id,
    });

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    meeting.files.push({
      filename: req.file.filename,

      path: req.file.path,
    });

    await meeting.save();

    res.status(200).json({
      message: "File uploaded successfully",

      file: req.file,
    });
  } catch (error) {
    console.error("UPLOAD FILE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
SAVE NYLAS NOTETAKER
*/

const saveNotetaker = async (req, res) => {
  try {
    const { notetakerId } = req.body;

    if (!notetakerId) {
      return res.status(400).json({
        message: "Notetaker ID is required",
      });
    }

    const meeting = await Meeting.findOneAndUpdate(
      {
        _id: req.params.id,

        organizer: req.user.id,
      },

      {
        notetakerId,
      },

      {
        new: true,
      },
    );

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    res.json({
      message: "Notetaker saved successfully",

      meeting,
    });
  } catch (error) {
    console.error("SAVE NOTETAKER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
GET MEETING RECORDING

The Backblaze B2 bucket is PRIVATE.

We generate a temporary signed URL.

Default lifetime:
1 hour
*/

const getMeetingRecording = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    const userId = req.user.id.toString();

    const organizerId = meeting.organizer.toString();

    const isParticipant = meeting.participants.some(
      (participant) => participant.toString() === userId,
    );

    if (organizerId !== userId && !isParticipant) {
      return res.status(403).json({
        message: "You do not have access to this recording",
      });
    }

    if (!meeting.recording?.storageKey) {
      return res.status(404).json({
        message: "Recording is not available",
      });
    }

    const signedUrl = await getSignedB2RecordingUrl(
      meeting.recording.storageKey,

      3600,
    );

    res.json({
      success: true,

      recording: {
        url: signedUrl,

        fileName: meeting.recording.fileName,

        mimeType: meeting.recording.mimeType,

        fileSize: meeting.recording.fileSize,

        duration: meeting.recording.duration,

        storageProvider: meeting.recording.storageProvider,

        uploadedAt: meeting.recording.uploadedAt,
      },
    });
  } catch (error) {
    console.error("GET RECORDING ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
EXPORTS
*/

module.exports = {
  createMeeting,

  getMyMeetings,

  joinMeeting,

  getMeetingById,

  updateMeetingNotes,

  updateMeeting,

  generateSummary,

  deleteMeeting,

  uploadFile,

  saveNotetaker,

  getMeetingRecording,
};
