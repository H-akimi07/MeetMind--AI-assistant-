const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const Meeting = require("../models/Meeting");

const router = express.Router();

/*
====================================================
HELPERS
====================================================
*/

// Extract Google Meet code
function getMeetCode(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (!parsed.hostname.includes("meet.google.com")) {
      return null;
    }

    const parts = parsed.pathname.split("/").filter(Boolean);

    return parts[0] || null;
  } catch (error) {
    return null;
  }
}

// Normalize Google Meet URLs
function normalizeMeetUrl(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    return `https://meet.google.com/${getMeetCode(url)}`;
  } catch {
    return url.trim().replace(/\/+$/, "").toLowerCase();
  }
}

/*
====================================================
NYLAS WEBHOOK VERIFICATION
====================================================
*/

router.get("/", (req, res) => {
  const challenge = req.query.challenge;

  if (challenge) {
    return res.status(200).send(challenge);
  }

  return res.status(200).send("MeetMind Nylas webhook is working");
});

/*
====================================================
VERIFY NYLAS SIGNATURE
====================================================
*/

function verifyNylasSignature(req) {
  const secret = process.env.NYLAS_WEBHOOK_SECRET;

  const signature =
    req.headers["x-nylas-signature"] || req.headers["X-Nylas-Signature"];

  if (!secret || !signature || !req.rawBody) {
    console.error("❌ Missing Nylas signature information");
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
====================================================
FIND MEETING
====================================================
*/

async function findMeetMindMeeting(meetingLink, notetakerId) {
  /*
  1. Try Notetaker ID
  */

  if (notetakerId) {
    const meetingByNotetaker = await Meeting.findOne({
      notetakerId,
    });

    if (meetingByNotetaker) {
      console.log("✅ Meeting found using Notetaker ID");

      return meetingByNotetaker;
    }
  }

  /*
  2. Try Google Meet code
  */

  const meetCode = getMeetCode(meetingLink);

  if (meetCode) {
    console.log("🔎 Google Meet code:", meetCode);

    const meetingByCode = await Meeting.findOne({
      meetingCode: meetCode,
    });

    if (meetingByCode) {
      console.log("✅ Meeting found using meetingCode");

      return meetingByCode;
    }
  }

  /*
  3. Try exact URL
  */

  if (meetingLink) {
    const meetingByUrl = await Meeting.findOne({
      meetingUrl: meetingLink,
    });

    if (meetingByUrl) {
      console.log("✅ Meeting found using exact URL");

      return meetingByUrl;
    }
  }

  /*
  4. Try normalized URL manually
  */

  if (meetCode) {
    const meetings = await Meeting.find({
      meetingUrl: {
        $regex: meetCode,
        $options: "i",
      },
    });

    if (meetings.length > 0) {
      console.log("✅ Meeting found using URL search");

      return meetings[0];
    }
  }

  return null;
}

/*
====================================================
NYLAS WEBHOOK EVENTS
====================================================
*/

router.post("/", async (req, res) => {
  try {
    /*
    IMPORTANT:
    Verify signature before processing.
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

    const notetaker = data?.object;

    if (!notetaker) {
      console.log("⚠️ No Notetaker object");
      return res.sendStatus(200);
    }

    const notetakerId = notetaker.id;
    const meetingLink = notetaker.meeting_link;

    console.log("🤖 Notetaker ID:", notetakerId);
    console.log("🔗 Meeting:", meetingLink);

    /*
    Respond immediately to Nylas.
    */

    res.sendStatus(200);

    /*
    MEETING STATE
    */

    if (type === "notetaker.meeting_state") {
      const state = notetaker.state || notetaker.status || "";

      console.log("🤖 Notetaker state:", state);

      const meeting = await findMeetMindMeeting(meetingLink, notetakerId);

      if (!meeting) {
        console.log("⚠️ MeetMind meeting not found during state event");

        return;
      }

      meeting.notetakerId = notetakerId;

      if (meetingLink) {
        meeting.meetingUrl = meetingLink;
      }

      if (
        state === "attending" ||
        state === "connecting" ||
        state === "recording"
      ) {
        meeting.status = "live";
      }

      meeting.notetakerStatus = state;

      await meeting.save();

      console.log("✅ Meeting state saved:", meeting._id.toString());

      return;
    }

    /*
    ONLY PROCESS MEDIA
    */

    if (type !== "notetaker.media") {
      console.log("ℹ️ Ignoring event:", type);
      return;
    }

    /*
    Nylas can send media events before media is actually
    ready. Only continue when available.
    */

    const mediaState = notetaker.state || notetaker.status || "";

    console.log("🎥 Media state:", mediaState);

    if (
      mediaState &&
      mediaState !== "available" &&
      mediaState !== "media_available"
    ) {
      console.log("⏳ Media is not ready yet. Waiting for next webhook.");

      return;
    }

    /*
    FIND MEETING
    */

    const meeting = await findMeetMindMeeting(meetingLink, notetakerId);

    if (!meeting) {
      console.log("⚠️ MeetMind meeting not found");

      console.log("Webhook meeting link:", meetingLink);

      console.log("Webhook meeting code:", getMeetCode(meetingLink));

      return;
    }

    console.log("✅ Found MeetMind meeting:", meeting._id.toString());

    /*
    GET MEDIA FROM NYLAS
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
      console.error(
        "❌ Nylas media request failed:",
        error.response?.data || error.message,
      );

      return;
    }

    const media = mediaResponse.data?.data || mediaResponse.data;

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
    SAVE EVERYTHING
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

    console.log("MongoDB ID:", meeting._id.toString());

    console.log("Transcript:", transcriptText ? "YES" : "NO");

    console.log("Summary:", summaryText ? "YES" : "NO");

    console.log("Action items:", actionItems.length);
  } catch (error) {
    console.error(
      "❌ Nylas webhook processing error:",
      error.response?.data || error.message,
    );
  }
});

module.exports = router;
