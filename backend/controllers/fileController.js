const fs = require("fs");
const path = require("path");
const Meeting = require("../models/Meeting");

// Download meeting attachment

const downloadMeetingFile = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    const attachment = meeting.attachments.id(req.params.fileId);

    if (!attachment) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const filename = path.basename(attachment.fileUrl);

    const filePath = path.join(process.cwd(), "uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Physical file not found",
      });
    }

    res.download(filePath, attachment.fileName);
  } catch (error) {
    console.error("DOWNLOAD FILE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete meeting attachment

const deleteMeetingFile = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    const attachment = meeting.attachments.id(req.params.fileId);

    if (!attachment) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const filename = path.basename(attachment.fileUrl);

    const filePath = path.join(process.cwd(), "uploads", filename);

    // Delete physical file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    attachment.deleteOne();

    await meeting.save();

    res.json({
      message: "File deleted successfully",
      meeting,
    });
  } catch (error) {
    console.error("DELETE FILE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  downloadMeetingFile,
  deleteMeetingFile,
};
