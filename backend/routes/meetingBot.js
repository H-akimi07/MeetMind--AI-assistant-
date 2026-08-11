const express = require("express");
const axios = require("axios");
const Meeting = require("../models/Meeting");

const router = express.Router();

router.post("/join", async (req, res) => {
  try {
    const { meetingId, meetingUrl } = req.body;

    // Validate Meeting ID
    if (!meetingId) {
      return res.status(400).json({
        success: false,
        message: "MeetMind meeting ID is required",
      });
    }

    // Validate Google Meet URL
    if (!meetingUrl) {
      return res.status(400).json({
        success: false,
        message: "Google Meet link is required",
      });
    }

    if (!meetingUrl.includes("meet.google.com")) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Google Meet link",
      });
    }

    // Find MeetMind meeting
    const mongoose = require("mongoose");

    let meeting;

    if (mongoose.Types.ObjectId.isValid(meetingId)) {
      meeting = await Meeting.findById(meetingId);
    } else {
      meeting = await Meeting.findOne({
        meetingCode: meetingId,
      });
    }

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "MeetMind meeting not found",
      });
    }

    console.log("🤖 Sending MeetMind AI to:", meetingUrl);
    console.log("📋 MeetMind Meeting:", meeting._id);

    // Create Nylas Notetaker
    const response = await axios.post(
      "https://api.us.nylas.com/v3/notetakers",
      {
        meeting_link: meetingUrl,

        name: "MeetMind AI",

        meeting_settings: {
          audio_recording: true,
          video_recording: true,
          transcription: true,
          summary: true,
          action_items: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NYLAS_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    console.log("✅ Nylas Notetaker created:", response.data);

    const notetaker = response.data?.data || response.data;

    const notetakerId = notetaker?.id;

    if (!notetakerId) {
      console.error("❌ No Notetaker ID returned by Nylas");

      return res.status(500).json({
        success: false,
        message: "Nylas did not return a Notetaker ID",
      });
    }

    // Connect Nylas Notetaker to MeetMind meeting
    meeting.notetakerId = notetakerId;
    meeting.meetingUrl = meetingUrl;
    meeting.notetakerStatus = "joining";
    meeting.status = "live";

    await meeting.save();

    console.log("🔗 Meeting connected to Notetaker:", notetakerId);

    res.status(201).json({
      success: true,
      message: "MeetMind AI is joining the meeting",

      meetingId: meeting._id,

      notetakerId,

      notetaker,
    });
  } catch (error) {
    console.error("❌ Nylas Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to send MeetMind AI to the meeting",
    });
  }
});

module.exports = router;
