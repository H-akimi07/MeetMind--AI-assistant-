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

    console.log("📩 Nylas webhook received:", type);

    // Respond immediately to Nylas
    res.sendStatus(200);

    // We only need media events for now
    if (type !== "notetaker.media") {
      console.log("ℹ️ Ignoring event:", type);
      return;
    }

    const notetaker = data?.object;

    if (!notetaker) {
      console.log("⚠️ No Notetaker object found");
      return;
    }

    const notetakerId = notetaker.id;
    const meetingLink = notetaker.meeting_link;

    console.log("🤖 Notetaker ID:", notetakerId);
    console.log("🔗 Meeting:", meetingLink);

    /*
      Find the MeetMind meeting.

      First try Notetaker ID.
      If this is the first webhook, try meeting URL.
    */
    let meeting = await Meeting.findOne({
      notetakerId,
    });

    if (!meeting && meetingLink) {
      meeting = await Meeting.findOne({
        meetingUrl: meetingLink,
      });
    }

    if (!meeting) {
      console.log("⚠️ MeetMind meeting not found");

      console.log("Webhook meeting link:", meetingLink);

      return;
    }

    /*
      Ask Nylas for fresh media URLs.
      Standalone Notetaker uses:
      /v3/notetakers/:id/media
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
      console.log("⚠️ Nylas returned no media");
      return;
    }

    console.log("🎥 Media received from Nylas");

    /*
      Download transcript
    */
    let transcriptText = "";

    if (media.transcript?.url) {
      try {
        const transcriptResponse = await axios.get(media.transcript.url);

        const transcriptData = transcriptResponse.data;

        /*
          Nylas normally provides speaker-labelled
          transcript segments.
        */

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
      Download Nylas summary
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
      } catch (error) {
        console.error("❌ Summary download failed:", error.message);
      }
    }

    /*
      Download action items
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
      } catch (error) {
        console.error("❌ Action items download failed:", error.message);
      }
    }

    /*
      Update MeetMind meeting
    */
    meeting.notetakerId = notetakerId;

    meeting.notetakerStatus =
      notetaker.state || notetaker.status || "media_available";

    if (meetingLink) {
      meeting.meetingUrl = meetingLink;
    }

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

    console.log("✅ MeetMind meeting updated successfully!");

    console.log("📝 Transcript:", transcriptText ? "YES" : "NO");

    console.log("📄 Summary:", summaryText ? "YES" : "NO");

    console.log("✅ Action items:", actionItems.length);
  } catch (error) {
    console.error(
      "❌ Nylas webhook processing error:",
      error.response?.data || error.message,
    );
  }
});

module.exports = router;
