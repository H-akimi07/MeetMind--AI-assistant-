const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Extract text from an uploaded file.
 *
 * Supported:
 * - PDF
 * - DOCX
 * - DOC
 * - TXT
 * - RTF
 *
 * Images are saved but text extraction is not attempted.
 */

const extractFileText = async (file) => {
  try {
    if (!file) {
      console.log("FILE EXTRACTION: No file provided");
      return "";
    }

    const fileType = file.mimetype;
    const extension = path.extname(file.originalname || "").toLowerCase();

    console.log("================================");
    console.log("FILE TEXT EXTRACTION");
    console.log("File:", file.originalname);
    console.log("Type:", fileType);
    console.log("Extension:", extension);
    console.log("Path:", file.path);
    console.log("================================");

    // PDF

    if (fileType === "application/pdf" || extension === ".pdf") {
      const dataBuffer = fs.readFileSync(file.path);

      const data = await pdf(dataBuffer);

      console.log("PDF TEXT LENGTH:", data.text?.length || 0);

      return data.text || "";
    }

    // DOCX

    if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      extension === ".docx"
    ) {
      const result = await mammoth.extractRawText({
        path: file.path,
      });

      console.log("DOCX TEXT LENGTH:", result.value?.length || 0);

      return result.value || "";
    }

    // DOC

    if (fileType === "application/msword" || extension === ".doc") {
      console.log("DOC extraction is not currently supported.");

      return "";
    }

    // TXT

    if (fileType === "text/plain" || extension === ".txt") {
      const text = fs.readFileSync(file.path, "utf8");

      console.log("TXT TEXT LENGTH:", text.length);

      return text;
    }

    // RTF

    if (fileType === "application/rtf" || extension === ".rtf") {
      const text = fs.readFileSync(file.path, "utf8");

      console.log("RTF TEXT LENGTH:", text.length);

      return text;
    }

    // IMAGES

    if (
      fileType === "image/png" ||
      fileType === "image/jpeg" ||
      fileType === "image/jpg" ||
      extension === ".png" ||
      extension === ".jpg" ||
      extension === ".jpeg"
    ) {
      console.log("IMAGE FILE: Saved successfully, no text extraction.");

      return "";
    }

    // UNSUPPORTED

    console.log("UNSUPPORTED FILE TYPE:", fileType, extension);

    return "";
  } catch (error) {
    console.error("FILE EXTRACTION ERROR:", error);

    return "";
  }
};

module.exports = extractFileText;
