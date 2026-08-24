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

function MeetingFiles({ meeting, onUploaded, onUpdated }) {
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  const files = meeting?.files || [];

  const getFileUrl = (file) => {
    if (!file?.url) return "#";

    if (file.url.startsWith("http")) {
      return file.url;
    }

    const backendUrl = API.defaults.baseURL.replace(/\/api\/?$/, "");

    return `${backendUrl}${file.url.startsWith("/") ? "" : "/"}${file.url}`;
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

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

      if (onUpdated) {
        await onUpdated();
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
    const type = file.mimetype || "";

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
          type="button"
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
          accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.mp3,.wav,.webm"
        />
      </div>

      {files.length === 0 ? (
        <div className="meeting-files-empty">
          <div className="meeting-files-empty-icon">
            <FiUploadCloud />
          </div>

          <h3>No documents yet</h3>

          <p>
            Upload a PDF, Word document, text file, image, or other supported
            meeting file.
          </p>

          <button type="button" onClick={handleChooseFile}>
            Upload your first file
          </button>
        </div>
      ) : (
        <div className="meeting-files-list">
          {files.map((file, index) => {
            const fileUrl = getFileUrl(file);

            return (
              <div
                className="meeting-file-item"
                key={file._id || `${file.filename}-${index}`}
              >
                <div className="meeting-file-left">
                  <div className="meeting-file-type">{getFileIcon(file)}</div>

                  <div className="meeting-file-info">
                    <strong>{file.originalName}</strong>

                    <div>
                      <span>{formatSize(file.size)}</span>

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
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open file"
                  >
                    <FiExternalLink />
                  </a>

                  <a
                    href={fileUrl}
                    download={file.originalName}
                    title="Download file"
                  >
                    <FiDownload />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {files.length > 0 && (
        <div className="meeting-files-footer">
          <span>
            {files.length} {files.length === 1 ? "file" : "files"} attached
          </span>

          <span>Text from supported documents can be used by MeetMind AI.</span>
        </div>
      )}
    </section>
  );
}

export default MeetingFiles;
