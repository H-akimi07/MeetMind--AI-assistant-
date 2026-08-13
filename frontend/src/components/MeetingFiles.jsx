import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { uploadMeetingFile } from "../api/meeting.js";
import API from "../api/axios.js";
import {
  FiFile,
  FiFileText,
  FiUploadCloud,
  FiDownload,
  FiExternalLink,
  FiImage,
  FiCheckCircle,
} from "react-icons/fi";

import "./MeetingFiles.css";

function MeetingFiles({ meeting, onUploaded }) {
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  const attachments = meeting?.attachments || [];

  const getFileUrl = (file) => {
    if (!file?.fileUrl) return "#";

    // Already an absolute URL
    if (file.fileUrl.startsWith("http")) {
      return file.fileUrl;
    }

    // Get backend base URL from Axios
    const backendUrl = API.defaults.baseURL.replace(/\/api\/?$/, "");

    return `${backendUrl}${file.fileUrl.startsWith("/") ? "" : "/"}${file.fileUrl}`;
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // 10 MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be smaller than 10 MB.");

      event.target.value = "";

      return;
    }

    try {
      setUploading(true);

      await uploadMeetingFile(meeting._id, file);

      toast.success("File uploaded successfully.");

      if (onUploaded) {
        await onUploaded();
      }
    } catch (error) {
      console.error("FILE UPLOAD ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to upload file.");
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  const formatSize = (bytes = 0) => {
    if (!bytes) return "Unknown size";

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (file) => {
    const type = file.mimeType || "";

    if (type.includes("image")) {
      return <FiImage />;
    }

    if (
      type.includes("pdf") ||
      type.includes("word") ||
      type.includes("text")
    ) {
      return <FiFileText />;
    }

    return <FiFile />;
  };

  return (
    <section className="meeting-files-panel">
      <div className="meeting-files-header">
        <div className="meeting-files-title">
          <div className="meeting-files-icon">
            <FiFileText />
          </div>

          <div>
            <h2>Meeting Documents</h2>

            <span>Upload files and use their content with MeetMind AI.</span>
          </div>
        </div>

        <button
          className="meeting-upload-btn"
          onClick={handleChooseFile}
          disabled={uploading}
        >
          <FiUploadCloud />

          {uploading ? "Uploading..." : "Upload File"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileChange}
          accept="
            .pdf,
            .doc,
            .docx,
            .txt,
            .csv,
            .xls,
            .xlsx,
            .ppt,
            .pptx,
            .png,
            .jpg,
            .jpeg,
            .webp,
            .mp3,
            .wav,
            .webm
          "
        />
      </div>

      {attachments.length === 0 ? (
        <div className="meeting-files-empty">
          <div className="meeting-files-empty-icon">
            <FiUploadCloud />
          </div>

          <h3>No documents yet</h3>

          <p>
            Upload a PDF, Word document, text file, image, or other supported
            meeting file.
          </p>

          <button onClick={handleChooseFile}>Upload your first file</button>
        </div>
      ) : (
        <div className="meeting-files-list">
          {attachments.map((file, index) => (
            <div
              className="meeting-file-item"
              key={`${file.storedName || file.fileName}-${index}`}
            >
              <div className="meeting-file-left">
                <div className="meeting-file-type">{getFileIcon(file)}</div>

                <div className="meeting-file-info">
                  <strong>{file.fileName}</strong>

                  <div>
                    <span>{formatSize(file.fileSize)}</span>

                    {file.extractedText ? (
                      <span className="file-text-status">
                        <FiCheckCircle />
                        AI-readable
                      </span>
                    ) : (
                      <span>Stored</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="meeting-file-actions">
                <a
                  href={getFileUrl(file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open file"
                >
                  <FiExternalLink />
                </a>

                <a
                  href={getFileUrl(file)}
                  download={file.fileName}
                  title="Download file"
                >
                  <FiDownload />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {attachments.length > 0 && (
        <div className="meeting-files-footer">
          <span>
            {attachments.length} {attachments.length === 1 ? "file" : "files"}{" "}
            attached
          </span>

          <span>Text from supported documents can be used by MeetMind AI.</span>
        </div>
      )}
    </section>
  );
}

export default MeetingFiles;
