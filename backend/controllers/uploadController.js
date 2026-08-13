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

    console.log("UPLOADED FILE:", req.file.originalname);

    // Extract text from PDF/DOCX/TXT/etc.
    const text = await extractFileText(req.file);

    // Save attachment information
    meeting.attachments.push({
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
    });

    // Save extracted text
    if (text && text.trim()) {
      meeting.fileContents =
        (meeting.fileContents || "") +
        "\n\n" +
        `===== ${req.file.originalname} =====\n\n` +
        text;
    }

    await meeting.save();

    console.log("EXTRACTED TEXT LENGTH:", text?.length || 0);

    res.status(200).json({
      message: "File uploaded successfully",
      file: {
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        extractedText: Boolean(text?.trim()),
      },
      meeting,
    });
  } catch (error) {
    console.error("UPLOAD MEETING FILE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadMeetingFile,
};
