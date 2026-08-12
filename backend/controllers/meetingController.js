const generateMeetingAI = require("../services/openaiService");
const Meeting = require("../models/Meeting");
const crypto = require("crypto");

// Create Meeting
const createMeeting = async (req, res) => {
  try {
    const { title, description, scheduledAt, duration, status } = req.body;

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
      meetingUrl: "",
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

// Get All Meetings of Logged-in User
const getMyMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      organizer: req.user.id,
    })
      .populate("participants", "fullName email")
      .sort({ scheduledAt: 1 });

    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Join Meeting
const joinMeeting = async (req, res) => {
  try {
    const { meetingCode } = req.body;

    const meeting = await Meeting.findOne({
      meetingCode,
    });

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    // Add user as participant

    if (!meeting.participants.includes(req.user.id)) {
      meeting.participants.push(req.user.id);

      await meeting.save();
    }

    res.json({
      message: "Joined meeting successfully",

      meeting,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//
//============= Get Meeting By Id====== //
//

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

    res.json(meeting);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Meeting Notes
const updateMeetingNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,

      {
        notes,
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
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,

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
      },
    );

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const generateSummary = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    const aiResult = await generateMeetingAI(meeting.notes);

    meeting.summary = aiResult.summary;
    meeting.actionItems = aiResult.actionItems;

    await meeting.save();

    res.json({
      message: "AI Summary Generated",
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Meeting ------ //

const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

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
    res.status(500).json({
      message: error.message,
    });
  }
};

const uploadFile = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

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
    res.status(500).json({
      message: error.message,
    });
  }
};

const saveNotetaker = async (req, res) => {
  try {
    const { notetakerId } = req.body;

    if (!notetakerId) {
      return res.status(400).json({
        message: "Notetaker ID is required",
      });
    }

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
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
    console.error("Save notetaker error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

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
};
