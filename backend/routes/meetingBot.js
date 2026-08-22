const express = require("express");
const axios = require("axios");

const Meeting = require("../models/Meeting");

const router = express.Router();

// SEND MEETMIND AI TO GOOGLE MEET

router.post("/join", async (req, res) => {
  try {
    const { meetingId, meetingUrl } = req.body;

    // VALIDATION

    if (!meetingId) {
      return res.status(400).json({
        success: false,
        message: "Meeting ID is required",
      });
    }

    if (!meetingUrl || !meetingUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "Google Meet link is required",
      });
    }

    const cleanMeetingUrl = meetingUrl.trim();

    if (!cleanMeetingUrl.includes("meet.google.com")) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Google Meet link",
      });
    }

    // FIND MEETMIND MEETING

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "MeetMind meeting not found",
      });
    }

    console.log("=================================");
    console.log("🤖 STARTING MEETMIND AI BOT");
    console.log("=================================");
    console.log("MongoDB Meeting ID:", meeting._id.toString());
    console.log("Google Meet URL:", cleanMeetingUrl);

    // SAVE GOOGLE MEET URL

    meeting.meetingUrl = cleanMeetingUrl;

    // Extract Google Meet code
    try {
      const parsedUrl = new URL(cleanMeetingUrl);

      const parts = parsedUrl.pathname.split("/").filter(Boolean);

      if (parts[0]) {
        meeting.googleMeetCode = parts[0];
      }
    } catch (error) {
      console.log("⚠️ Could not extract Google Meet code");
    }

    // CREATE NYLAS NOTETAKER

    const response = await axios.post(
      "https://api.us.nylas.com/v3/notetakers",
      {
        meeting_link: cleanMeetingUrl,

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

    console.log("✅ Nylas Notetaker created:");

    console.log(JSON.stringify(response.data, null, 2));

    // EXTRACT NOTETAKER

    const notetaker = response.data?.data || response.data;

    const notetakerId = notetaker?.id;

    if (!notetakerId) {
      console.error("❌ No Notetaker ID returned by Nylas");

      return res.status(500).json({
        success: false,
        message: "Nylas did not return a Notetaker ID",
      });
    }

    console.log("🔗 Notetaker ID:", notetakerId);

    // THIS IS THE IMPORTANT PART
    // LINK NYLAS TO MONGODB MEETING

    meeting.notetakerId = notetakerId;

    meeting.notetakerStatus = notetaker.state || "connecting";

    meeting.status = "live";

    await meeting.save();

    console.log("✅ Notetaker linked to MongoDB meeting");
    console.log("MongoDB Meeting:", meeting._id.toString());
    console.log("Nylas Notetaker:", notetakerId);

    // RESPONSE

    return res.status(201).json({
      success: true,

      message: "MeetMind AI is joining the meeting",

      meetingId: meeting._id,

      notetakerId,

      meetingUrl: cleanMeetingUrl,

      notetaker,
    });
  } catch (error) {
    console.error("❌ Nylas Error:");

    console.error("STATUS:", error.response?.status);

    console.error("DATA:", JSON.stringify(error.response?.data, null, 2));

    console.error("MESSAGE:", error.message);

    return res.status(500).json({
      success: false,

      message:
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to send MeetMind AI to the meeting",
    });
  }
});

module.exports = router;
