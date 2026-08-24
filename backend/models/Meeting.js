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

    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "cancelled"],
      default: "scheduled",
    },

    // GOOGLE MEET

    meetingUrl: {
      type: String,
      default: "",
      trim: true,
    },

    googleMeetCode: {
      type: String,
      default: "",
      trim: true,
    },

    meetingCode: {
      type: String,
      required: true,
      unique: true,
    },

    // USERS

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

    // NYLAS NOTETAKER

    notetakerId: {
      type: String,
      default: "",
    },

    notetakerStatus: {
      type: String,
      default: "",
    },

    // MEETING CONTENT

    notes: {
      type: String,
      default: "",
    },

    transcript: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

    keyPoints: {
      type: [String],
      default: [],
    },

    actionItems: {
      type: [String],
      default: [],
    },

    decisions: {
      type: [String],
      default: [],
    },

    deadlines: {
      type: [String],
      default: [],
    },

    fileContents: {
      type: String,
      default: "",
    },

    // MEETING FILES

    attachments: [
      {
        filename: {
          type: String,
          default: "",
        },

        originalName: {
          type: String,
          default: "",
        },

        path: {
          type: String,
          default: "",
        },

        url: {
          type: String,
          default: "",
        },

        mimetype: {
          type: String,
          default: "",
        },

        size: {
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

    // RECORDING

    recording: {
      url: {
        type: String,
        default: "",
      },

      fileName: {
        type: String,
        default: "",
      },

      mimeType: {
        type: String,
        default: "video/mp4",
      },

      fileSize: {
        type: Number,
        default: 0,
      },

      duration: {
        type: Number,
        default: 0,
      },

      storageProvider: {
        type: String,
        default: "",
      },

      storageKey: {
        type: String,
        default: "",
      },

      uploadedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  },
);

// INDEXES

meetingSchema.index({ organizer: 1, scheduledAt: 1 });
meetingSchema.index({ googleMeetCode: 1 });
meetingSchema.index({ notetakerId: 1 });

module.exports = mongoose.model("Meeting", meetingSchema);
