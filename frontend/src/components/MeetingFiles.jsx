import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  uploadMeetingFile,
  downloadMeetingFile,
  deleteMeetingFile,
} from "../api/meeting.js";
import API from "../api/axios.js";

import {
  FiFile,
  FiFileText,
  FiUploadCloud,
  FiDownload,
  FiExternalLink,
  FiImage,
  FiCheckCircle,
  FiTrash2,
} from "react-icons/fi";

import "./MeetingFiles.css";

function MeetingFiles({ meeting, onUploaded }) {
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState(null);

  /*
   * IMPORTANT:
   * Backend stores files inside "attachments",
   * not "files".
   */
  const files = meeting?.attachments || [];

  /*
   * Build the complete backend URL.
   *
   * Example:
   * /uploads/1787581229064.pdf
   *
   * becomes:
   * https://meetmind-ai-assistant.onrender.com/uploads/1787581229064.pdf
   */
  const getFileUrl = (file) => {
    if (!file?.fileUrl) {
      return "#";
    }

    if (file.fileUrl.startsWith("http")) {
      return file.fileUrl;
    }

    const backendUrl = API.defaults.baseURL.replace(/\/api\/?$/, "");

    return `${backendUrl}${
      file.fileUrl.startsWith("/") ? "" : "/"
    }${file.fileUrl}`;
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

      /*
       * Reload meeting so the new attachment
       * appears immediately in the UI.
       */
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

  const handleDownloadFile = async (file) => {
    if (!file?._id) {
      toast.error("File ID is missing.");
      return;
    }

    try {
      const response = await downloadMeetingFile(meeting._id, file._id);

      const blob = new Blob([response.data], {
        type: file.mimeType || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = file.fileName || file.storedName || "download";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("DOWNLOAD FILE ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to download file.");
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!fileId) {
      toast.error("File ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this file?",
    );

    if (!confirmed) return;

    try {
      setDeletingFileId(fileId);

      await deleteMeetingFile(meeting._id, fileId);

      toast.success("File deleted successfully.");

      if (onUploaded) {
        await onUploaded();
      }
    } catch (error) {
      console.error("DELETE FILE ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to delete file.");
    } finally {
      setDeletingFileId(null);
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
    const type = file?.mimeType || "";

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

          <button type="button" onClick={handleChooseFile} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload your first file"}
          </button>
        </div>
      ) : (
        <div className="meeting-files-list">
          {files.map((file, index) => {
            const fileUrl = getFileUrl(file);

            return (
              <div
                className="meeting-file-item"
                key={file._id || `${file.storedName}-${index}`}
              >
                <div className="meeting-file-left">
                  <div className="meeting-file-type">{getFileIcon(file)}</div>

                  <div className="meeting-file-info">
                    <strong>{file.fileName || file.storedName}</strong>

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
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open file"
                  >
                    <FiExternalLink />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDownloadFile(file)}
                    title="Download file"
                    className="meeting-file-download"
                  >
                    <FiDownload />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteFile(file._id)}
                    disabled={deletingFileId === file._id}
                    title="Delete file"
                    className="meeting-file-delete"
                  >
                    <FiTrash2 />
                  </button>
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
