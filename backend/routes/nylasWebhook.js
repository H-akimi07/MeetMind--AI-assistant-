const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const Meeting = require("../models/Meeting");

const router = express.Router();

/*
WEBHOOK VERIFICATION
*/

router.get("/", (req, res) => {
  const challenge = req.query.challenge;

  if (challenge) {
    return res.status(200).send(challenge);
  }

  return res.status(200).send("MeetMind Nylas webhook is working");
});

/*
VERIFY NYLAS SIGNATURE
*/

function verifyNylasSignature(req) {
  const secret = process.env.NYLAS_WEBHOOK_SECRET;
  const signature = req.get("x-nylas-signature");

  if (!secret) {
    console.error("❌ NYLAS_WEBHOOK_SECRET is missing");
    return false;
  }

  if (!signature) {
    console.error("❌ x-nylas-signature header is missing");
    return false;
  }

  if (!req.rawBody) {
    console.error("❌ Raw webhook body is missing");
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(req.rawBody)
    .digest("hex");

  const expected = Buffer.from(expectedSignature, "utf8");
  const received = Buffer.from(signature, "utf8");

  if (expected.length !== received.length) {
    console.error("❌ Signature length mismatch");
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
}

/*
NORMALIZE MEETING URL
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
GET GOOGLE MEET CODE
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
FIND MEETING
*/

async function findMeetMindMeeting({ notetakerId, meetingLink }) {
  /*
  1. BEST MATCH:
  Notetaker ID
  */

  if (notetakerId) {
    const meeting = await Meeting.findOne({
      notetakerId: notetakerId,
    });

    if (meeting) {
      console.log("✅ Meeting found by Notetaker ID");

      return meeting;
    }
  }

  /*
  2. SECOND:
  Exact Google Meet URL
  */

  if (meetingLink) {
    const normalizedUrl = normalizeMeetingUrl(meetingLink);

    const meetings = await Meeting.find({
      meetingUrl: {
        $exists: true,
        $ne: "",
      },
    });

    const meeting = meetings.find(
      (item) => normalizeMeetingUrl(item.meetingUrl) === normalizedUrl,
    );

    if (meeting) {
      console.log("✅ Meeting found by Google Meet URL");

      return meeting;
    }
  }

  /*
  3. THIRD:
  Google Meet code
  */

  const meetingCode = getMeetingCode(meetingLink);

  if (meetingCode) {
    const meeting = await Meeting.findOne({
      meetingCode: meetingCode,
    });

    if (meeting) {
      console.log("✅ Meeting found by Google Meet code");

      return meeting;
    }
  }

  return null;
}

/*
NYLAS WEBHOOK
*/

router.post("/", async (req, res) => {
  try {
    /*
    Verify signature BEFORE doing anything.
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
    Respond immediately.
    */

    res.sendStatus(200);

    const notetaker = data?.object;

    if (!notetaker) {
      console.log("⚠️ No Notetaker object");
      return;
    }

    const notetakerId = notetaker.id;

    const meetingLink = notetaker.meeting_link || notetaker.meetingLink || "";

    console.log("🤖 Notetaker ID:", notetakerId);

    console.log("🔗 Meeting:", meetingLink);

    /*
        MEETING STATE
        */

    if (type === "notetaker.meeting_state") {
      const state = notetaker.state || notetaker.status || "";

      console.log("🤖 Notetaker state:", state);

      const meeting = await findMeetMindMeeting({
        notetakerId,
        meetingLink,
      });

      if (!meeting) {
        console.log("⚠️ MeetMind meeting not found during state event");

        return;
      }

      meeting.notetakerId = notetakerId;

      meeting.notetakerStatus = state;

      if (meetingLink) {
        meeting.meetingUrl = meetingLink;
      }

      if (
        state === "attending" ||
        state === "recording" ||
        state === "connected"
      ) {
        meeting.status = "live";
      }

      await meeting.save();

      console.log("✅ Meeting state saved");

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
    Nylas sends media when processing is complete.
    */

    const state = notetaker.state || notetaker.status || "";

    console.log("🎥 Media state:", state);

    /*
    If media is not ready yet, don't fail.
    Nylas may send another event.
    */

    if (state && state !== "available" && state !== "media_available") {
      console.log("⏳ Media not ready yet:", state);

      return;
    }

    /*
        FIND MEETING
        */

    const meeting = await findMeetMindMeeting({
      notetakerId,
      meetingLink,
    });

    if (!meeting) {
      console.log("❌ MeetMind meeting not found");

      console.log("Notetaker ID:", notetakerId);

      console.log("Meeting URL:", meetingLink);

      /*
      VERY IMPORTANT DEBUG:
      Show meetings in MongoDB that have
      a Notetaker ID.
      */

      const possibleMeetings = await Meeting.find({
        notetakerId: {
          $exists: true,
          $ne: "",
        },
      })
        .select("_id meetingCode meetingUrl notetakerId status")
        .limit(10);

      console.log("📋 Meetings with Notetaker IDs:", possibleMeetings);

      return;
    }

    console.log("✅ MeetMind meeting found:", meeting._id);

    /*
        GET MEDIA
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
        const response = await axios.get(media.transcript.url);

        const data = response.data;

        if (Array.isArray(data?.transcript)) {
          transcriptText = data.transcript
            .map((item) => {
              const speaker = item.speaker || "Speaker";

              const text = item.text || "";

              return `${speaker}: ${text}`;
            })
            .join("\n");
        } else if (typeof data?.transcript === "string") {
          transcriptText = data.transcript;
        } else if (typeof data === "string") {
          transcriptText = data;
        }

        console.log("📝 Transcript:", transcriptText ? "YES" : "NO");
      } catch (error) {
        console.error("❌ Transcript error:", error.message);
      }
    }

    /*
        SUMMARY
        */

    let summaryText = "";

    if (media.summary?.url) {
      try {
        const response = await axios.get(media.summary.url);

        const data = response.data;

        if (typeof data === "string") {
          summaryText = data;
        } else if (typeof data?.summary === "string") {
          summaryText = data.summary;
        } else {
          summaryText = JSON.stringify(data);
        }

        console.log("📄 Summary:", summaryText ? "YES" : "NO");
      } catch (error) {
        console.error("❌ Summary error:", error.message);
      }
    }

    /*
        ACTION ITEMS
        */

    let actionItems = [];

    if (media.action_items?.url) {
      try {
        const response = await axios.get(media.action_items.url);

        const data = response.data;

        if (Array.isArray(data)) {
          actionItems = data.map((item) =>
            typeof item === "string" ? item : JSON.stringify(item),
          );
        } else if (Array.isArray(data?.action_items)) {
          actionItems = data.action_items.map((item) =>
            typeof item === "string" ? item : JSON.stringify(item),
          );
        }

        console.log("✅ Action items:", actionItems.length);
      } catch (error) {
        console.error("❌ Action items error:", error.message);
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

    console.log("Meeting ID:", meeting._id);

    console.log("Notetaker ID:", notetakerId);

    console.log("📝 Transcript:", transcriptText ? "YES" : "NO");

    console.log("📄 Summary:", summaryText ? "YES" : "NO");

    console.log("✅ Action items:", actionItems.length);

    console.log("=================================");
    console.log("✅ MEETING SAVED BEFORE NYLAS");
    console.log("MongoDB Meeting ID:", meeting._id);
    console.log("Meeting Code:", meeting.meetingCode);
    console.log("Google Meet URL:", meeting.meetingUrl);
    console.log("Notetaker ID:", meeting.notetakerId);
    console.log("=================================");
  } catch (error) {
    console.error(
      "❌ Nylas webhook processing error:",
      error.response?.data || error.message,
    );
  }
});

module.exports = router;
