const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    // BASIC MEETING INFORMATION

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // MeetMind's own meeting code
    meetingCode: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    // Google Meet URL
    meetingUrl: {
      type: String,
      default: "",
      trim: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      default: 60,
    },

    // MEETING NOTES

    // Notes written manually by the user
    notes: {
      type: String,
      default: "",
    },

    // NYLAS AI / NOTETAKER DATA

    // Nylas Notetaker ID
    notetakerId: {
      type: String,
      default: "",
      trim: true,
    },

    // connecting / attending / completed / etc.
    notetakerStatus: {
      type: String,
      default: "",
      trim: true,
    },

    // TRANSCRIPT

    // Transcript generated from the Google Meet
    transcript: {
      type: String,
      default: "",
    },

    // AI SUMMARY

    summary: {
      type: String,
      default: "",
    },

    // AI ANALYSIS

    keyPoints: [
      {
        type: String,
      },
    ],

    actionItems: [
      {
        type: String,
      },
    ],

    decisions: [
      {
        type: String,
      },
    ],

    deadlines: [
      {
        type: String,
      },
    ],

    // RECORDING

    recordingUrl: {
      type: String,
      default: "",
    },

    recordingDuration: {
      type: Number,
      default: 0,
    },

    // UPLOADED FILES

    files: [
      {
        filename: {
          type: String,
        },

        path: {
          type: String,
        },
      },
    ],

    attachments: [
      {
        fileName: {
          type: String,
        },

        fileUrl: {
          type: String,
        },

        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Extracted text from uploaded files
    fileContents: {
      type: String,
      default: "",
    },

    // MEETING STATUS

    status: {
      type: String,

      enum: ["scheduled", "live", "completed", "cancelled"],

      default: "scheduled",
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Meeting", meetingSchema);
