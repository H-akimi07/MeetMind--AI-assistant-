const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const Meeting = require("../models/Meeting");

const router = express.Router();

/*
========================================
NYLAS WEBHOOK VERIFICATION
========================================
*/

router.get("/", (req, res) => {
  const challenge = req.query.challenge;

  if (challenge) {
    return res.status(200).send(challenge);
  }

  return res.status(200).send("MeetMind Nylas webhook is working");
});

/*
========================================
VERIFY NYLAS SIGNATURE
========================================
*/

function verifyNylasSignature(req) {
  const secret = process.env.NYLAS_WEBHOOK_SECRET;
  const signature = req.get("x-nylas-signature");

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
========================================
NORMALIZE GOOGLE MEET URL
========================================
*/

function normalizeMeetingUrl(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}`
      .replace(/\/+$/, "")
      .toLowerCase();
  } catch {
    return url.trim().replace(/\/+$/, "").toLowerCase();
  }
}

/*
========================================
EXTRACT GOOGLE MEET CODE
========================================
*/

function getMeetingCode(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    return parsed.pathname
      .replace(/^\/+|\/+$/g, "")
      .split("/")[0]
      .toLowerCase();
  } catch {
    return null;
  }
}

/*
========================================
FIND MEETMIND MEETING
========================================
*/

async function findMeetMindMeeting(notetakerId, meetingLink) {
  /*
    FIRST:
    The Notetaker ID is the strongest identifier.

    meetingBot.js already saves this ID when
    the bot is created.
  */

  if (notetakerId) {
    const meetingByNotetaker = await Meeting.findOne({
      notetakerId: notetakerId,
    });

    if (meetingByNotetaker) {
      console.log("✅ Meeting found by Notetaker ID");

      return meetingByNotetaker;
    }
  }

  /*
    SECOND:
    Try normalized Google Meet URL.
  */

  if (meetingLink) {
    const normalizedWebhookUrl = normalizeMeetingUrl(meetingLink);

    const meetings = await Meeting.find({
      meetingUrl: { $exists: true, $ne: "" },
    });

    const meetingByUrl = meetings.find((meeting) => {
      return normalizeMeetingUrl(meeting.meetingUrl) === normalizedWebhookUrl;
    });

    if (meetingByUrl) {
      console.log("✅ Meeting found by Google Meet URL");

      return meetingByUrl;
    }
  }

  /*
    THIRD:
    Try Google Meet meeting code.

    Example:
    https://meet.google.com/aof-tmxg-irb
    code = aof-tmxg-irb
  */

  const meetingCode = getMeetingCode(meetingLink);

  if (meetingCode) {
    const meetingByCode = await Meeting.findOne({
      meetingCode: meetingCode,
    });

    if (meetingByCode) {
      console.log("✅ Meeting found by Google Meet code");

      return meetingByCode;
    }
  }

  return null;
}

/*
========================================
NYLAS WEBHOOK EVENTS
========================================
*/

router.post("/", async (req, res) => {
  try {
    /*
      ALWAYS verify the signature first.
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
      Respond immediately to Nylas.

      Nylas expects a 200 quickly.
    */

    res.sendStatus(200);

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
    MEETING STATE
    */

    if (type === "notetaker.meeting_state") {
      const state = notetaker.state || notetaker.status || "";

      console.log("🤖 Notetaker state:", state);

      const meeting = await findMeetMindMeeting(notetakerId, meetingLink);

      if (!meeting) {
        console.log("⚠️ MeetMind meeting not found for state event");
        return;
      }

      meeting.notetakerId = notetakerId;
      meeting.notetakerStatus = state;

      if (meetingLink) {
        meeting.meetingUrl = meetingLink;
      }

      /*
        Don't mark completed here.
        The media event is the important final event.
      */

      if (
        state === "attending" ||
        state === "recording" ||
        state === "connected"
      ) {
        meeting.status = "live";
      }

      await meeting.save();

      console.log("✅ Meeting state updated:", state);

      return;
    }

    /*
    IGNORE OTHER EVENTS
    */

    if (type !== "notetaker.media") {
      console.log("ℹ️ Ignoring event:", type);
      return;
    }

    /*
    MEDIA EVENT
    */

    const state = notetaker.state || notetaker.status || "";

    console.log("🎥 Media state:", state);

    /*
      Nylas may send media events before the media
      is actually ready.

      Don't try to download it until available.
    */

    if (state && state !== "available" && state !== "media_available") {
      console.log("⏳ Media is not ready yet. Current state:", state);

      return;
    }

    /*
    FIND MEETING
    */

    const meeting = await findMeetMindMeeting(notetakerId, meetingLink);

    if (!meeting) {
      console.log("❌ MeetMind meeting not found");

      console.log("Notetaker ID:", notetakerId);
      console.log("Webhook meeting link:", meetingLink);

      return;
    }

    console.log("✅ MeetMind meeting found:", meeting._id);

    /*
    GET MEDIA FROM NYLAS
    
    This is correct for a standalone Notetaker.
    */

    let mediaResponse;

    try {
      mediaResponse = await axios.get(
        `https://api.us.nylas.com/v3/notetakers/${notetakerId}/media`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NYLAS_API_KEY}`,
            Accept: "application/json",
          },
        },
      );
    } catch (error) {
      const status = error.response?.status;

      const message =
        error.response?.data?.message || error.response?.data || error.message;

      /*
        Media can briefly be unavailable.
        Nylas may send another webhook later.
      */

      if (status === 404) {
        console.log("⏳ Nylas media is not ready yet");

        return;
      }

      console.error("❌ Nylas media request failed:", message);

      return;
    }

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
    UPDATE MEETING
    */

    meeting.notetakerId = notetakerId;

    meeting.notetakerStatus = "media_available";

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
      meeting.recordingDuration = Number(media.recording.duration);
    }

    meeting.status = "completed";

    await meeting.save();

    console.log("=================================");
    console.log("✅ MEETING UPDATED SUCCESSFULLY");
    console.log("=================================");

    console.log("Meeting ID:", meeting._id);
    console.log("Notetaker ID:", notetakerId);
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
