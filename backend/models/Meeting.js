const express = require("express");
const crypto = require("crypto");
const axios = require("axios");

const Meeting = require("../models/Meeting");

const { uploadToB2 } = require("../services/b2Service");

const router = express.Router();

/*====
HELPERS====
*/

// Extract Google Meet code
function getMeetCode(url) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);

    if (!parsed.hostname.includes("meet.google.com")) {
      return null;
    }

    const parts = parsed.pathname.split("/").filter(Boolean);

    return parts[0] || null;
  } catch {
    return null;
  }
}

// Normalize Google Meet URL
function normalizeMeetUrl(url) {
  if (!url) {
    return "";
  }

  const meetCode = getMeetCode(url);

  if (meetCode) {
    return `https://meet.google.com/${meetCode}`;
  }

  return url.trim().replace(/\/+$/, "").toLowerCase();
}

/*====
VERIFY NYLAS WEBHOOK SIGNATURE====
*/

function verifyNylasSignature(req) {
  const secret = process.env.NYLAS_WEBHOOK_SECRET;

  const signature = req.headers["x-nylas-signature"];

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

/*====
FIND MEETING====
*/

async function findMeetMindMeeting(meetingLink, notetakerId) {
  /*
  1. Notetaker ID
  */

  if (notetakerId) {
    const meeting = await Meeting.findOne({
      notetakerId,
    });

    if (meeting) {
      console.log("✅ Meeting found using Notetaker ID");

      return meeting;
    }
  }

  /*
  2. Google Meet code
  */

  const meetCode = getMeetCode(meetingLink);

  if (meetCode) {
    const meeting = await Meeting.findOne({
      googleMeetCode: meetCode,
    });

    if (meeting) {
      console.log("✅ Meeting found using Google Meet code");

      return meeting;
    }
  }

  /*
  3. Exact URL
  */

  if (meetingLink) {
    const meeting = await Meeting.findOne({
      meetingUrl: meetingLink,
    });

    if (meeting) {
      console.log("✅ Meeting found using exact URL");

      return meeting;
    }
  }

  /*
  4. Normalized URL
  */

  const normalized = normalizeMeetUrl(meetingLink);

  if (normalized) {
    const meeting = await Meeting.findOne({
      meetingUrl: normalized,
    });

    if (meeting) {
      console.log("✅ Meeting found using normalized URL");

      return meeting;
    }
  }

  /*
  5. URL regex
  */

  if (meetCode) {
    const meeting = await Meeting.findOne({
      meetingUrl: {
        $regex: meetCode,
        $options: "i",
      },
    });

    if (meeting) {
      console.log("✅ Meeting found using URL regex");

      return meeting;
    }
  }

  return null;
}

/*====
DOWNLOAD JSON / TEXT MEDIA====
*/

async function downloadMediaJson(url) {
  if (!url) {
    return null;
  }

  const response = await axios.get(url, {
    responseType: "json",

    timeout: 120000,
  });

  return response.data;
}

/*====
TRANSCRIPT PARSER====
*/

function parseTranscript(data) {
  if (!data) {
    return "";
  }

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        const speaker =
          item.speaker || item.speaker_name || item.speakerName || "Speaker";

        const text = item.text || item.transcript || item.content || "";

        return text ? `${speaker}: ${text}` : "";
      })
      .filter(Boolean)
      .join("\n");
  }

  if (Array.isArray(data.transcript)) {
    return parseTranscript(data.transcript);
  }

  if (typeof data.transcript === "string") {
    return data.transcript;
  }

  if (Array.isArray(data.segments)) {
    return data.segments
      .map((item) => {
        const speaker =
          item.speaker || item.speaker_name || item.speakerName || "Speaker";

        const text = item.text || item.content || "";

        return text ? `${speaker}: ${text}` : "";
      })
      .filter(Boolean)
      .join("\n");
  }

  return JSON.stringify(data);
}

/*====
ACTION ITEMS PARSER====
*/

function parseActionItems(data) {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data.map((item) =>
      typeof item === "string" ? item : JSON.stringify(item),
    );
  }

  if (Array.isArray(data.action_items)) {
    return data.action_items.map((item) =>
      typeof item === "string" ? item : JSON.stringify(item),
    );
  }

  if (Array.isArray(data.actionItems)) {
    return data.actionItems.map((item) =>
      typeof item === "string" ? item : JSON.stringify(item),
    );
  }

  return [];
}

/*====
SUMMARY PARSER====
*/

function parseSummary(data) {
  if (!data) {
    return "";
  }

  if (typeof data === "string") {
    return data;
  }

  if (typeof data.summary === "string") {
    return data.summary;
  }

  if (typeof data.text === "string") {
    return data.text;
  }

  return JSON.stringify(data);
}

/*====
UPLOAD RECORDING TO BACKBLAZE B2====

The recording is streamed directly from Nylas
into Backblaze B2.

This avoids loading the entire MP4 into
Render memory.====
*/

async function uploadRecordingToB2({
  recordingUrl,
  meetingId,
  notetakerId,
  fileName,
  mimeType,
}) {
  if (!recordingUrl) {
    throw new Error("Recording URL is missing");
  }

  console.log("⬇️ Streaming recording from Nylas...");

  const response = await axios.get(recordingUrl, {
    responseType: "stream",

    timeout: 600000,

    maxContentLength: Infinity,

    maxBodyLength: Infinity,
  });

  const safeFileName = fileName || `meeting-${meetingId}.mp4`;

  const storageKey = `recordings/${meetingId}/${notetakerId}/${safeFileName}`;

  const contentType =
    mimeType || response.headers["content-type"] || "video/mp4";

  const contentLength = response.headers["content-length"];

  console.log("☁️ Uploading recording to Backblaze B2...");

  await uploadToB2({
    stream: response.data,

    key: storageKey,

    contentType,

    contentLength,
  });

  console.log("✅ Recording uploaded to Backblaze B2");

  console.log("📦 B2 storage key:", storageKey);

  return {
    storageKey,

    fileSize: Number(contentLength || 0),

    mimeType: contentType,
  };
}

/*====
WEBHOOK VERIFICATION / CHALLENGE====
*/

router.get("/", (req, res) => {
  const challenge = req.query.challenge;

  if (challenge) {
    return res.status(200).send(challenge);
  }

  return res.status(200).send("MeetMind Nylas webhook is working");
});

/*====
NYLAS WEBHOOK====
*/

router.post("/", async (req, res) => {
  try {
    /*
  
    VERIFY SIGNATURE
  
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
  
    ACKNOWLEDGE NYLAS IMMEDIATELY
  
    */

    res.sendStatus(200);

    /*
  
    MEETING STATE EVENT
  
    */

    if (type === "notetaker.meeting_state") {
      const state = notetaker.state || notetaker.status || "";

      console.log("🤖 Notetaker state:", state);

      const meeting = await findMeetMindMeeting(meetingLink, notetakerId);

      if (!meeting) {
        console.log("⚠️ MeetMind meeting not found");

        return;
      }

      const meetCode = getMeetCode(meetingLink);

      if (meetCode) {
        meeting.googleMeetCode = meetCode;
      }

      meeting.notetakerId = notetakerId;

      meeting.notetakerStatus = state;

      if (meetingLink) {
        meeting.meetingUrl = meetingLink;
      }

      if (
        state === "connecting" ||
        state === "attending" ||
        state === "recording"
      ) {
        meeting.status = "live";
      }

      if (state === "failed_entry" || state === "cancelled") {
        meeting.status = "cancelled";
      }

      await meeting.save();

      console.log("✅ Meeting state saved:", meeting._id.toString());

      return;
    }

    /*
  
    MEDIA ONLY
  
    */

    if (type !== "notetaker.media") {
      console.log("ℹ️ Ignoring event:", type);

      return;
    }

    /*
  
    FIND MEETING
  
    */

    const meeting = await findMeetMindMeeting(meetingLink, notetakerId);

    if (!meeting) {
      console.log("⚠️ MeetMind meeting not found for media");

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

          timeout: 120000,
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
  
    RECORDING → BACKBLAZE B2
  
    */

    const recording = media.recording;

    if (recording?.url) {
      try {
        console.log("🎬 Recording found");

        console.log("Recording size:", recording.size);

        console.log("Recording duration:", recording.duration);

        const fileName = recording.name || `meeting-${meeting._id}.mp4`;

        const mimeType = recording.type || "video/mp4";

        const b2Result = await uploadRecordingToB2({
          recordingUrl: recording.url,

          meetingId: meeting._id.toString(),

          notetakerId,

          fileName,

          mimeType,
        });

        /*
        Save recording metadata
        */

        meeting.recording = {
          /*
          Do not store a permanent public URL.

          The B2 bucket is private.

          The backend generates a temporary
          signed URL when the frontend requests
          the recording.
          */

          url: "",

          fileName,

          mimeType: b2Result.mimeType,

          fileSize: b2Result.fileSize,

          duration: Number(recording.duration || 0),

          storageProvider: "backblaze-b2",

          storageKey: b2Result.storageKey,

          uploadedAt: new Date(),
        };

        console.log("✅ Recording permanently stored in B2");

        console.log("📦 B2 key:", b2Result.storageKey);
      } catch (error) {
        console.error("❌ Recording storage failed:", error.message);
      }
    } else {
      console.log("⚠️ No recording URL found");
    }

    /*
  
    TRANSCRIPT
  
    */

    if (media.transcript?.url) {
      try {
        console.log("📝 Downloading transcript...");

        const transcriptData = await downloadMediaJson(media.transcript.url);

        const transcriptText = parseTranscript(transcriptData);

        if (transcriptText) {
          meeting.transcript = transcriptText;
        }

        console.log("📝 Transcript:", transcriptText ? "YES" : "NO");
      } catch (error) {
        console.error("❌ Transcript download failed:", error.message);
      }
    }

    /*
  
    SUMMARY
  
    */

    if (media.summary?.url) {
      try {
        console.log("📄 Downloading summary...");

        const summaryData = await downloadMediaJson(media.summary.url);

        const summaryText = parseSummary(summaryData);

        if (summaryText) {
          meeting.summary = summaryText;
        }

        console.log("📄 Summary:", summaryText ? "YES" : "NO");
      } catch (error) {
        console.error("❌ Summary download failed:", error.message);
      }
    }

    /*
  
    ACTION ITEMS
  
    */

    if (media.action_items?.url) {
      try {
        console.log("✅ Downloading action items...");

        const actionData = await downloadMediaJson(media.action_items.url);

        const actionItems = parseActionItems(actionData);

        if (actionItems.length > 0) {
          meeting.actionItems = actionItems;
        }

        console.log("✅ Action items:", actionItems.length);
      } catch (error) {
        console.error("❌ Action items download failed:", error.message);
      }
    }

    /*
  
    FINAL MEETING INFORMATION
  
    */

    meeting.notetakerId = notetakerId;

    meeting.notetakerStatus = "media_available";

    if (meetingLink) {
      meeting.meetingUrl = meetingLink;
    }

    const meetCode = getMeetCode(meetingLink);

    if (meetCode) {
      meeting.googleMeetCode = meetCode;
    }

    meeting.status = "completed";

    await meeting.save();

    /*
  
    SUCCESS LOG
  
    */

    console.log("=================================");

    console.log("✅ MEETING UPDATED SUCCESSFULLY");

    console.log("=================================");

    console.log("MongoDB ID:", meeting._id.toString());

    console.log("Notetaker ID:", meeting.notetakerId);

    console.log("Transcript:", meeting.transcript ? "YES" : "NO");

    console.log("Summary:", meeting.summary ? "YES" : "NO");

    console.log("Action items:", meeting.actionItems.length);

    console.log("Recording:", meeting.recording?.storageKey ? "YES" : "NO");

    console.log("B2 key:", meeting.recording?.storageKey || "NONE");
  } catch (error) {
    console.error(
      "❌ Nylas webhook processing error:",
      error.response?.data || error.message,
    );
  }
});

module.exports = router;
