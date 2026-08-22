const express = require("express");
const axios = require("axios");

const Meeting = require("../models/Meeting");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*    SEND MEETMIND AI TO GOOGLE MEET    */

router.post("/join", authMiddleware, async (req, res) => {
  try {
    const { meetingUrl } = req.body;

    console.log("=================================");
    console.log("🤖 MEETMIND BOT REQUEST");
    console.log("=================================");
    console.log("Request body:", req.body);
    console.log("User ID:", req.user?.id);

    /*   VALIDATE GOOGLE MEET URL  */

    if (!meetingUrl || typeof meetingUrl !== "string") {
      return res.status(400).json({
        success: false,
        message: "Google Meet link is required",
      });
    }

    const cleanMeetingUrl = meetingUrl.trim();

    let parsedUrl;

    try {
      parsedUrl = new URL(cleanMeetingUrl);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Google Meet link",
      });
    }

    if (
      parsedUrl.protocol !== "https:" ||
      parsedUrl.hostname !== "meet.google.com"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Google Meet link",
      });
    }

    /*
    EXTRACT GOOGLE MEET CODE
    */

    const meetingCode = parsedUrl.pathname.split("/").filter(Boolean)[0];

    if (!meetingCode) {
      return res.status(400).json({
        success: false,
        message: "Google Meet meeting code is missing",
      });
    }

    const normalizedUrl = `https://meet.google.com/${meetingCode}`;

    console.log("🔗 Google Meet:", normalizedUrl);
    console.log("🔑 Meeting Code:", meetingCode);

    /*
    FIND EXISTING MEETMIND MEETING

    First try the Google Meet code.
    */

    let meeting = await Meeting.findOne({
      organizer: req.user.id,
      googleMeetCode: meetingCode,
    });

    /*
    If no meeting exists, try meetingUrl.
    */

    if (!meeting) {
      meeting = await Meeting.findOne({
        organizer: req.user.id,
        meetingUrl: normalizedUrl,
      });
    }

    /*
    If still no meeting exists, create one.

    This makes the Join Meeting page work even
    when the user has not created a meeting first.
    */

    if (!meeting) {
      console.log("🆕 No existing MeetMind meeting found");
      console.log("📝 Creating a new meeting...");

      meeting = await Meeting.create({
        title: `Google Meet - ${meetingCode}`,

        description: "Meeting joined through MeetMind AI",

        scheduledAt: new Date(),

        duration: 60,

        status: "scheduled",

        meetingUrl: normalizedUrl,

        googleMeetCode: meetingCode,

        organizer: req.user.id,

        participants: [req.user.id],

        meetingCode: require("crypto").randomUUID(),
      });

      console.log("✅ New MeetMind meeting created:", meeting._id);
    } else {
      console.log("✅ Existing MeetMind meeting found:", meeting._id);

      meeting.meetingUrl = normalizedUrl;
      meeting.googleMeetCode = meetingCode;
    }

    /*
    CREATE NYLAS NOTETAKER
    */

    if (!process.env.NYLAS_API_KEY) {
      console.error("❌ NYLAS_API_KEY is missing");

      return res.status(500).json({
        success: false,
        message: "Nylas API key is not configured",
      });
    }

    console.log("🤖 Creating Nylas Notetaker...");

    const response = await axios.post(
      "https://api.us.nylas.com/v3/notetakers",
      {
        meeting_link: normalizedUrl,

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

    console.log("✅ Nylas response:");
    console.log(JSON.stringify(response.data, null, 2));

    /*
    EXTRACT NOTETAKER
    */

    const notetaker = response.data?.data || response.data;

    const notetakerId = notetaker?.id;

    if (!notetakerId) {
      console.error("❌ Nylas did not return a Notetaker ID");

      return res.status(500).json({
        success: false,
        message: "Nylas did not return a Notetaker ID",
      });
    }

    /*
    SAVE NOTETAKER INFORMATION
    */

    meeting.notetakerId = notetakerId;

    meeting.notetakerStatus = notetaker.state || "connecting";

    meeting.status = "live";

    await meeting.save();

    console.log("=================================");
    console.log("✅ MEETMIND BOT CONNECTED");
    console.log("=================================");
    console.log("MongoDB Meeting ID:", meeting._id.toString());
    console.log("Google Meet:", normalizedUrl);
    console.log("Notetaker ID:", notetakerId);
    console.log("=================================");

    /*
    RESPONSE
    */

    return res.status(201).json({
      success: true,

      message: "MeetMind AI is joining the meeting",

      meetingId: meeting._id,

      notetakerId,

      meetingUrl: normalizedUrl,

      notetaker,
    });
  } catch (error) {
    console.error("=================================");
    console.error("❌ MEETMIND BOT ERROR");
    console.error("=================================");

    console.error("STATUS:", error.response?.status);

    console.error("DATA:", JSON.stringify(error.response?.data, null, 2));

    console.error("MESSAGE:", error.message);

    return res.status(error.response?.status || 500).json({
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
