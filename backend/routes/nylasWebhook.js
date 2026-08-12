const express = require("express");
const axios = require("axios");
const Meeting = require("../models/Meeting");

const router = express.Router();

/*
  Nylas webhook verification
*/
router.get("/", (req, res) => {
  const challenge = req.query.challenge;

  if (challenge) {
    return res.status(200).send(challenge);
  }

  res.status(200).send("MeetMind Nylas webhook is working");
});

/*
  Nylas webhook events
*/
router.post("/", async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log("=================================");
    console.log("📩 NYLAS WEBHOOK:", type);
    console.log("=================================");

    // Respond immediately
    res.sendStatus(200);

    // We only need media events
    if (type !== "notetaker.media") {
      console.log("ℹ️ Ignoring:", type);
      return;
    }

    const notetaker = data?.object;

    if (!notetaker) {
      console.log("⚠️ No notetaker object");
      return;
    }

    const notetakerId = notetaker.id;
    const meetingLink = notetaker.meeting_link;

    console.log("🤖 Notetaker:", notetakerId);
    console.log("🔗 Meeting:", meetingLink);

    /*
      Get fresh media URLs from Nylas.
      Standalone Notetaker endpoint.
    */
    const mediaResponse = await axios.get(
      `https://api.us.nylas.com/v3/notetakers/${notetakerId}/media`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NYLAS_API_KEY}`,
          Accept: "application/json",
        },
      },
    );

    const media = mediaResponse.data?.data;

    if (!media) {
      console.log("⚠️ No media returned");
      return;
    }

    console.log("🎥 Media is ready!");

    /*
      ============================
      TRANSCRIPT
      ============================
    */

    let transcriptText = "";

    if (media.transcript?.url) {
      try {
        const transcriptResponse = await axios.get(media.transcript.url);

        const transcriptData = transcriptResponse.data;

        console.log("📝 Transcript downloaded");

        if (Array.isArray(transcriptData?.transcript)) {
          transcriptText = transcriptData.transcript
            .map((item) => {
              const speaker = item.speaker || "Speaker";
              const text = item.text || "";

              return `${speaker}: ${text}`;
            })
            .join("\n");
        } else if (typeof transcriptData?.transcript === "string") {
          transcriptText = transcriptData.transcript;
        } else if (typeof transcriptData === "string") {
          transcriptText = transcriptData;
        }
      } catch (error) {
        console.error("❌ Transcript download failed:", error.message);
      }
    }

    /*
      ============================
      SUMMARY
      ============================
    */

    let summaryText = "";

    if (media.summary?.url) {
      try {
        const summaryResponse = await axios.get(media.summary.url);

        const summaryData = summaryResponse.data;

        if (typeof summaryData === "string") {
          summaryText = summaryData;
        } else if (typeof summaryData?.summary === "string") {
          summaryText = summaryData.summary;
        } else {
          summaryText = JSON.stringify(summaryData);
        }

        console.log("📄 Summary downloaded");
      } catch (error) {
        console.error("❌ Summary download failed:", error.message);
      }
    }

    /*
      ============================
      ACTION ITEMS
      ============================
    */

    let actionItems = [];

    if (media.action_items?.url) {
      try {
        const actionResponse = await axios.get(media.action_items.url);

        const actionData = actionResponse.data;

        if (Array.isArray(actionData)) {
          actionItems = actionData.map((item) =>
            typeof item === "string" ? item : JSON.stringify(item),
          );
        } else if (Array.isArray(actionData?.action_items)) {
          actionItems = actionData.action_items.map((item) =>
            typeof item === "string" ? item : JSON.stringify(item),
          );
        }

        console.log("✅ Action items:", actionItems.length);
      } catch (error) {
        console.error("❌ Action items download failed:", error.message);
      }
    }

    /*
      ============================
      FIND EXISTING MEETING
      ============================
    */

    let meeting = null;

    if (meetingLink) {
      meeting = await Meeting.findOne({
        meetingUrl: meetingLink,
      });
    }

    /*
      If we cannot find a MeetMind meeting,
      don't crash.
    */

    if (!meeting) {
      console.log("⚠️ No MeetMind meeting found for:", meetingLink);

      console.log("📝 Transcript received:", transcriptText ? "YES" : "NO");

      console.log("📄 Summary received:", summaryText ? "YES" : "NO");

      return;
    }

    /*
      ============================
      SAVE TO MEETING
      ============================
    */

    meeting.notetakerId = notetakerId;

    meeting.notetakerStatus = "media_available";

    meeting.meetingUrl = meetingLink;

    if (transcriptText) {
      meeting.transcript = transcriptText;
    }

    if (summaryText) {
      meeting.summary = summaryText;
    }

    if (actionItems.length > 0) {
      meeting.actionItems = actionItems;
    }

    if (media.recording?.url) {
      meeting.recordingUrl = media.recording.url;
    }

    if (media.recording?.duration) {
      meeting.recordingDuration = media.recording.duration;
    }

    meeting.status = "completed";

    await meeting.save();

    console.log("=================================");

    console.log("✅ MEETING UPDATED SUCCESSFULLY");

    console.log("📝 Transcript:", transcriptText ? "YES" : "NO");

    console.log("📄 Summary:", summaryText ? "YES" : "NO");

    console.log("✅ Action Items:", actionItems.length);

    console.log("=================================");
  } catch (error) {
    console.error(
      "❌ Nylas webhook processing error:",
      error.response?.data || error.message,
    );
  }
});

module.exports = router;
