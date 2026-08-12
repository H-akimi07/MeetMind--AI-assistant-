const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/join", async (req, res) => {
  try {
    const { meetingUrl } = req.body;

    // Validate Google Meet URL
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

    console.log("🤖 Sending MeetMind AI to:", cleanMeetingUrl);

    // Create Nylas Notetaker
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

    console.log("🔗 Notetaker ID:", notetakerId);

    return res.status(201).json({
      success: true,
      message: "MeetMind AI is joining the meeting",

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
