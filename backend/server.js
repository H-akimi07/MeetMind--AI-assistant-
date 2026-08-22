const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    /*
    BASIC MEETING INFORMATION
    */

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

    // MeetMind's own internal meeting code
    meetingCode: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    // Google Meet code
    // Example: cms-nztc-zsb
    googleMeetCode: {
      type: String,
      default: "",
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

    /*
    MEETING NOTES
    */

    notes: {
      type: String,
      default: "",
    },

    /*
    NYLAS NOTETAKER
    */

    notetakerId: {
      type: String,
      default: "",
      trim: true,
    },

    notetakerStatus: {
      type: String,
      default: "",
      trim: true,
    },

    /*
    TRANSCRIPT
    */

    transcript: {
      type: String,
      default: "",
    },

    /*
    AI SUMMARY
    */

    summary: {
      type: String,
      default: "",
    },

    /*
    AI ANALYSIS
    */

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

    /*
    RECORDING

    Recording is stored in a PRIVATE
    Backblaze B2 bucket.

    The URL is generated temporarily by
    the backend when the user requests it.
    */

    recording: {
      // Temporary signed URL
      url: {
        type: String,
        default: "",
      },

      // Original recording filename
      fileName: {
        type: String,
        default: "",
      },

      // Recording MIME type
      mimeType: {
        type: String,
        default: "video/mp4",
      },

      // Recording size in bytes
      fileSize: {
        type: Number,
        default: 0,
      },

      // Recording duration in seconds
      duration: {
        type: Number,
        default: 0,
      },

      // Storage provider
      storageProvider: {
        type: String,
        default: "",
      },

      // Backblaze B2 object key
      //
      // Example:
      // recordings/meetingId/notetakerId/file.mp4
      storageKey: {
        type: String,
        default: "",
      },

      // Upload timestamp
      uploadedAt: {
        type: Date,
      },
    },

    /*
    UPLOADED FILES
    */

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

    /*
    ATTACHMENTS
    */

    attachments: [
      {
        fileName: {
          type: String,
          required: true,
        },

        storedName: {
          type: String,
          default: "",
        },

        fileUrl: {
          type: String,
          required: true,
        },

        mimeType: {
          type: String,
          default: "",
        },

        fileSize: {
          type: Number,
          default: 0,
        },

        extractedText: {
          type: String,
          default: "",
        },

        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /*
    EXTRACTED FILE CONTENT
    */

    fileContents: {
      type: String,
      default: "",
    },

    /*
    MEETING STATUS
    */

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
