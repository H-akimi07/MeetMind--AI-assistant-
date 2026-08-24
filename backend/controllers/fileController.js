const fs = require("fs");
const path = require("path");

const Meeting = require("../models/Meeting");
const extractFileText = require("../services/fileServices");
// UPLOAD MEETING FILE
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

    console.log("================================");
    console.log("UPLOADED FILE");
    console.log("Original:", req.file.originalname);
    console.log("Stored:", req.file.filename);
    console.log("Path:", req.file.path);
    console.log("Size:", req.file.size);
    console.log("Type:", req.file.mimetype);
    console.log("================================");

    // Extract text
    const extractedText = await extractFileText(req.file);

    // Public URL
    const fileUrl = `/uploads/${req.file.filename}`;

    // Make sure files exists
    if (!meeting.files) {
      meeting.files = [];
    }

    // Save file metadata
    meeting.files.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      url: fileUrl,
      mimetype: req.file.mimetype,
      size: req.file.size,
      extractedText: extractedText || "",
    });

    // Add extracted text to AI context
    if (extractedText && extractedText.trim()) {
      meeting.fileContents = [
        meeting.fileContents || "",
        `\n--- ${req.file.originalname} ---\n`,
        extractedText,
      ].join("\n");
    }

    await meeting.save();

    console.log("================================");
    console.log("FILE SAVED TO DATABASE");
    console.log("FILE URL:", fileUrl);
    console.log("EXTRACTED TEXT:", extractedText?.length || 0);
    console.log("================================");

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        id: meeting.attachments[meeting.attachments.length - 1]._id,
        fileName: req.file.originalname,
        storedName: req.file.filename,
        fileUrl,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        extractedText: Boolean(extractedText?.trim()),
      },
    });
  } catch (error) {
    console.error("UPLOAD FILE ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to upload file",
    });
  }
};
// DOWNLOAD MEETING FILE
const downloadMeetingFile = async (req, res) => {
  try {
    const { id, fileId } = req.params;

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    const file = meeting.files.id(fileId);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const filename = file.filename;

    if (!filename) {
      return res.status(404).json({
        message: "Stored filename is missing",
      });
    }

    const uploadsDirectory = path.join(process.cwd(), "uploads");

    const filePath = path.join(uploadsDirectory, filename);

    console.log("================================");
    console.log("DOWNLOAD REQUEST");
    console.log("Meeting:", id);
    console.log("File ID:", fileId);
    console.log("Original Name:", file.originalName);
    console.log("Stored Name:", filename);
    console.log("File Path:", filePath);
    console.log("Exists:", fs.existsSync(filePath));
    console.log("================================");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Physical file not found on server",
      });
    }

    return res.download(filePath, file.originalName || filename, (error) => {
      if (error) {
        console.error("FILE DOWNLOAD ERROR:", error);

        if (!res.headersSent) {
          res.status(500).json({
            message: "Failed to download file",
          });
        }
      }
    });
  } catch (error) {
    console.error("DOWNLOAD FILE ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to download file",
    });
  }
};
// DELETE MEETING FILE
const deleteMeetingFile = async (req, res) => {
  try {
    const { id, fileId } = req.params;

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    const file = meeting.files.id(fileId);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const filename = file.filename;

    if (filename) {
      const filePath = path.join(process.cwd(), "uploads", filename);

      console.log("DELETE FILE PATH:", filePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);

        console.log("Physical file deleted");
      }
    }

    file.deleteOne();

    await meeting.save();

    return res.json({
      message: "File deleted successfully",
      meeting,
    });
  } catch (error) {
    console.error("DELETE FILE ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to delete file",
    });
  }
};

module.exports = {
  uploadMeetingFile,
  downloadMeetingFile,
  deleteMeetingFile,
};
