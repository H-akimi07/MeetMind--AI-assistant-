const path = require("path");
const Meeting = require("../models/Meeting");

const { transcribeAudio } = require("../services/transcriptionService");

const { generateMeetingSummary } = require("../services/openaiService");

const uploadAudio = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    // Save uploaded audio path
    meeting.audioUrl = `/uploads/audio/${req.file.filename}`;

    // Full file path
    const fullPath = path.join(__dirname, "..", meeting.audioUrl);

    // Speech → Text
    const transcript = await transcribeAudio(fullPath);

    meeting.notes = transcript;

    // AI Summary
    const ai = await generateMeetingSummary(transcript);

    meeting.summary = ai.summary;
    meeting.keyPoints = ai.keyPoints;
    meeting.actionItems = ai.actionItems;
    meeting.decisions = ai.decisions;
    meeting.deadlines = ai.deadlines;

    await meeting.save();

    res.json({
      message: "Audio processed successfully",
      transcript,
      summary: ai.summary,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadAudio,
};
