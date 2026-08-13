const Meeting = require("../models/Meeting");
const extractFileText = require("../services/fileServices");

const uploadMeetingFile = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    console.log("📎 FILE UPLOAD:", {
      meetingId: meeting._id,
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Extract text for AI
    const extractedText = await extractFileText(req.file);

    // Save file information
    const attachment = {
      fileName: req.file.originalname,

      storedName: req.file.filename,

      fileUrl: `/uploads/${req.file.filename}`,

      mimeType: req.file.mimetype,

      fileSize: req.file.size,

      extractedText,

      uploadedAt: new Date(),
    };

    meeting.attachments.push(attachment);

    // Keep your existing fileContents system
    if (extractedText.trim()) {
      meeting.fileContents =
        (meeting.fileContents || "") +
        `\n\n===== ${req.file.originalname} =====\n\n` +
        extractedText;
    }

    await meeting.save();

    res.status(201).json({
      message: "File uploaded successfully",

      file: attachment,

      meeting,
    });
  } catch (error) {
    console.error("❌ UPLOAD FILE ERROR:", error);

    res.status(500).json({
      message: error.message || "File upload failed",
    });
  }
};

module.exports = {
  uploadMeetingFile,
};
