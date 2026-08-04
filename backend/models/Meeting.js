const mongoose = require("mongoose");


const meetingSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
  },


  description: {
    type: String,
    default: "",
  },

files:[
 {
   filename:String,
   path:String
 }
],

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


  meetingCode: {
    type: String,
    unique: true,
    required: true,
  },


  scheduledAt: {
    type: Date,
    required: true,
  },


  duration: {
    type: Number,
    default: 60,
  },


  notes: {
    type: String,
    default: "",
  },


  summary: {
    type: String,
    default: "",
  },


  // User written meeting notes
notes: {
  type: String,
  default: "",
},


// Extracted text from uploaded files
fileContents: {
  type: String,
  default: "",
},


// AI generated summary
summary: {
  type: String,
  default: "",
},


  keyPoints: [
    {
      type: String,
    }
  ],


  actionItems: [
    {
      type: String,
    }
  ],


  decisions: [
    {
      type: String,
    }
  ],


  deadlines: [
    {
      type: String,
    }
  ],



  // Uploaded files
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
    }
  ],



  status: {
    type: String,
    enum:[
      "scheduled",
      "live",
      "completed",
      "cancelled"
    ],
    default:"scheduled",
  },


},


{
  timestamps:true
}

);


module.exports = mongoose.model(
  "Meeting",
  meetingSchema
);