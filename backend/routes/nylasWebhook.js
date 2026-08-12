const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const Meeting = require("../models/Meeting");

const router = express.Router();

/*
NYLAS WEBHOOK VERIFICATION

*/

router.get("/", (req, res) => {
  const challenge = req.query.challenge;

  if (challenge) {
    return res.status(200).send(challenge);
  }

  res.status(200).send("MeetMind Nylas webhook is working");
});

/*

VERIFY NYLAS SIGNATURE

*/

function verifyNylasSignature(req) {
  const secret = process.env.NYLAS_WEBHOOK_SECRET;
  const signature = req.headers["x-nylas-signature"];

  if (!secret || !signature || !req.rawBody) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(req.rawBody)
    .digest("hex");

  const expected = Buffer.from(expectedSignature, "utf8");
  const received = Buffer.from(signature, "utf8");

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
}

/*

NYLAS WEBHOOK EVENTS

*/

router.post("/", async (req, res) => {
  try {
    /*
    Verify BEFORE processing anything.
    */
    if (!verifyNylasSignature(req)) {
      console.error("❌ Invalid Nylas webhook signature");

      return res.status(401).send("Invalid signature");
    }

    console.log("✅ Nylas webhook signature verified");

    const { type, data } = req.body;

    console.log("=================================");
    console.log("📩 NYLAS WEBHOOK:", type);
    console.log("=================================");

    /*
    Tell Nylas we received the webhook.
    */
    res.sendStatus(200);

    /*
    
    MEETING STATE
    
    */

    if (type === "notetaker.meeting_state") {
      const notetaker = data?.object;

      if (!notetaker) {
        console.log("⚠️ No notetaker object");
        return;
      }

      console.log("🤖 Notetaker state:", notetaker.state || notetaker.status);

      console.log("🔗 Meeting:", notetaker.meeting_link);

      return;
    }

    /*
    
    MEDIA EVENT
    
    */

    if (type !== "notetaker.media") {
      console.log("ℹ️ Ignoring event:", type);
      return;
    }

    const notetaker = data?.object;

    if (!notetaker) {
      console.log("⚠️ No Notetaker object");
      return;
    }

    const notetakerId = notetaker.id;
    const meetingLink = notetaker.meeting_link;

    console.log("🤖 Notetaker ID:", notetakerId);
    console.log("🔗 Meeting:", meetingLink);

    /*
    
    GET MEDIA FROM NYLAS
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
    
    TRANSCRIPT
    
    */

    let transcriptText = "";

    if (media.transcript?.url) {
      try {
        const transcriptResponse = await axios.get(media.transcript.url);

        const transcriptData = transcriptResponse.data;

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

        console.log("📝 Transcript:", transcriptText ? "YES" : "NO");
      } catch (error) {
        console.error("❌ Transcript download failed:", error.message);
      }
    }

    /*
    
    SUMMARY
    
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

        console.log("📄 Summary:", summaryText ? "YES" : "NO");
      } catch (error) {
        console.error("❌ Summary download failed:", error.message);
      }
    }

    /*
    ACTION ITEMS
    
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
    
    FIND MEETING
    
    */

    let meeting = null;

    if (meetingLink) {
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
    
    SAVE DATA TO MEETING
    
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
    console.log("=================================");
  } catch (error) {
    console.error(
      "❌ Nylas webhook processing error:",
      error.response?.data || error.message,
    );
  }
});

module.exports = router;
