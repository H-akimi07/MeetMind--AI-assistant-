const express = require("express");
const crypto = require("crypto");
const axios = require("axios");

const Meeting = require("../models/Meeting");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

/*

HELPERS

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
  } catch (error) {
    return null;
  }
}

// Normalize Google Meet URL
function normalizeMeetUrl(url) {
  if (!url) {
    return "";
  }

  try {
    const meetCode = getMeetCode(url);

    if (meetCode) {
      return `https://meet.google.com/${meetCode}`;
    }

    return url.trim().replace(/\/+$/, "").toLowerCase();
  } catch {
    return url.trim().replace(/\/+$/, "").toLowerCase();
  }
}

/*

VERIFY NYLAS WEBHOOK SIGNATURE

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

FIND MEETING

*/

async function findMeetMindMeeting(meetingLink, notetakerId) {
  // 1. PRIMARY METHOD:
  //    NYLAS NOTETAKER ID

  if (notetakerId) {
    const meetingByNotetaker = await Meeting.findOne({
      notetakerId,
    });

    if (meetingByNotetaker) {
      console.log("✅ Meeting found using Notetaker ID");

      return meetingByNotetaker;
    }
  }

  // 2. GOOGLE MEET CODE

  const meetCode = getMeetCode(meetingLink);

  if (meetCode) {
    console.log("🔎 Google Meet code:", meetCode);

    const meetingByGoogleCode = await Meeting.findOne({
      googleMeetCode: meetCode,
    });

    if (meetingByGoogleCode) {
      console.log("✅ Meeting found using Google Meet code");

      return meetingByGoogleCode;
    }
  }

  // 3. EXACT URL

  if (meetingLink) {
    const meetingByUrl = await Meeting.findOne({
      meetingUrl: meetingLink,
    });

    if (meetingByUrl) {
      console.log("✅ Meeting found using exact URL");

      return meetingByUrl;
    }
  }

  // 4. NORMALIZED URL

  const normalized = normalizeMeetUrl(meetingLink);

  if (normalized) {
    const meetingByNormalizedUrl = await Meeting.findOne({
      meetingUrl: normalized,
    });

    if (meetingByNormalizedUrl) {
      console.log("✅ Meeting found using normalized URL");

      return meetingByNormalizedUrl;
    }
  }

  return null;
}

/*

DOWNLOAD JSON / TEXT MEDIA

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

/*

TRANSCRIPT PARSER

*/

function parseTranscript(data) {
  if (!data) {
    return "";
  }

  // Direct string
  if (typeof data === "string") {
    return data;
  }

  // Nylas transcript array
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        const speaker = item.speaker || item.speaker_name || "Speaker";

        const text = item.text || item.transcript || item.content || "";

        if (!text) {
          return "";
        }

        return `${speaker}: ${text}`;
      })
      .filter(Boolean)
      .join("\n");
  }

  // Nested transcript
  if (Array.isArray(data.transcript)) {
    return parseTranscript(data.transcript);
  }

  if (typeof data.transcript === "string") {
    return data.transcript;
  }

  // Other possible nested formats
  if (Array.isArray(data.segments)) {
    return data.segments
      .map((item) => {
        const speaker = item.speaker || item.speaker_name || "Speaker";

        const text = item.text || item.content || "";

        return text ? `${speaker}: ${text}` : "";
      })
      .filter(Boolean)
      .join("\n");
  }

  return JSON.stringify(data);
}

/*

ACTION ITEMS PARSER

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

/*

SUMMARY PARSER

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

/*

UPLOAD RECORDING TO CLOUDINARY

*/

async function uploadRecordingToCloudinary(recordingUrl, meetingId) {
  if (!recordingUrl) {
    throw new Error("Recording URL is missing");
  }

  console.log("⬇️ Downloading recording from Nylas...");

  const recordingResponse = await axios.get(recordingUrl, {
    responseType: "stream",
    timeout: 300000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  console.log("☁️ Uploading recording to Cloudinary...");

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",

        folder: "meetmind/recordings",

        public_id: `meeting-${meetingId}`,

        overwrite: true,

        type: "upload",
      },

      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);

          return reject(error);
        }

        console.log("✅ Recording uploaded to Cloudinary");

        resolve(result);
      },
    );

    recordingResponse.data.pipe(uploadStream);

    recordingResponse.data.on("error", (error) => {
      reject(error);
    });
  });
}

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

NYLAS WEBHOOK

*/

router.post("/", async (req, res) => {
  try {
    // ========================================
    // VERIFY SIGNATURE
    // ========================================

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

    // ========================================
    // ACKNOWLEDGE NYLAS IMMEDIATELY
    // ========================================

    res.sendStatus(200);

    // ========================================
    // MEETING STATE
    // ========================================

    if (type === "notetaker.meeting_state") {
      const state = notetaker.state || notetaker.status || "";

      const meetingState = notetaker.meeting_state || "";

      console.log("🤖 Notetaker state:", state);

      console.log("🤖 Meeting state:", meetingState);

      const meeting = await findMeetMindMeeting(meetingLink, notetakerId);

      if (!meeting) {
        console.log("⚠️ MeetMind meeting not found during state event");

        return;
      }

      // Save Google Meet code
      const meetCode = getMeetCode(meetingLink);

      if (meetCode) {
        meeting.googleMeetCode = meetCode;
      }

      meeting.notetakerId = notetakerId;

      meeting.notetakerStatus = state;

      if (meetingLink) {
        meeting.meetingUrl = meetingLink;
      }

      // Bot is active
      if (
        state === "connecting" ||
        state === "attending" ||
        state === "recording"
      ) {
        meeting.status = "live";
      }

      // Failed states
      if (state === "failed_entry" || state === "cancelled") {
        meeting.status = "cancelled";
      }

      await meeting.save();

      console.log("✅ Meeting state saved:", meeting._id.toString());

      return;
    }

    // ========================================
    // ONLY PROCESS MEDIA
    // ========================================

    if (type !== "notetaker.media") {
      console.log("ℹ️ Ignoring event:", type);

      return;
    }

    // ========================================
    // MEDIA STATE
    // ========================================

    const mediaState = notetaker.state || notetaker.status || "";

    console.log("🎥 Media state:", mediaState);

    // Nylas normally sends available
    if (
      mediaState &&
      mediaState !== "available" &&
      mediaState !== "media_available"
    ) {
      console.log("⏳ Media is not ready yet");

      return;
    }

    // ========================================
    // FIND MEETING
    // ========================================

    const meeting = await findMeetMindMeeting(meetingLink, notetakerId);

    if (!meeting) {
      console.log("⚠️ MeetMind meeting not found");

      return;
    }

    console.log("✅ Found MeetMind meeting:", meeting._id.toString());

    // ========================================
    // GET FRESH MEDIA LINKS
    // ========================================

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

    // ========================================
    // RECORDING
    // ========================================

    const recording = media.recording;

    if (recording?.url) {
      try {
        console.log("🎬 Recording found");

        console.log("Recording size:", recording.size);

        console.log("Recording duration:", recording.duration);

        const cloudinaryResult = await uploadRecordingToCloudinary(
          recording.url,
          meeting._id.toString(),
        );

        meeting.recording = {
          url: cloudinaryResult.secure_url,

          fileName: recording.name || `meeting-${meeting._id}.mp4`,

          mimeType: recording.type || "video/mp4",

          fileSize: Number(recording.size || 0),

          duration: Number(recording.duration || 0),

          storageProvider: "cloudinary",

          storageKey: cloudinaryResult.public_id,

          uploadedAt: new Date(),
        };

        console.log("✅ Recording permanently stored");

        console.log("Recording URL:", cloudinaryResult.secure_url);
      } catch (error) {
        console.error("❌ Recording storage failed:", error.message);
      }
    } else {
      console.log("⚠️ No recording URL found");
    }

    // ========================================
    // TRANSCRIPT
    // ========================================

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

    // ========================================
    // SUMMARY
    // ========================================

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

    // ========================================
    // ACTION ITEMS
    // ========================================

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

    // ========================================
    // FINAL MEETING UPDATE
    // ========================================

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

    console.log("=================================");

    console.log("✅ MEETING UPDATED SUCCESSFULLY");

    console.log("=================================");

    console.log("MongoDB ID:", meeting._id.toString());

    console.log("Transcript:", meeting.transcript ? "YES" : "NO");

    console.log("Summary:", meeting.summary ? "YES" : "NO");

    console.log("Action items:", meeting.actionItems.length);

    console.log("Recording:", meeting.recording?.url ? "YES" : "NO");
  } catch (error) {
    console.error(
      "❌ Nylas webhook processing error:",

      error.response?.data || error.message,
    );
  }
});

module.exports = router;
