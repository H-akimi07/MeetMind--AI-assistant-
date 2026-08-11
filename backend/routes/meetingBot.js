const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/join", async (req, res) => {
  try {
    const { meetingUrl } = req.body;

    // Check meeting URL
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

    console.log("🤖 Sending MeetMind AI to:", meetingUrl);

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

    res.status(201).json({
      success: true,
      message: "MeetMind AI is joining the meeting",
      notetaker: response.data,
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
