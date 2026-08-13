import { useRef, useState } from "react";
import toast from "react-hot-toast";

import {
  uploadMeetingFile,
  downloadMeetingFile,
  deleteMeetingFile,
} from "../api/meeting.js";

import {
  FiUploadCloud,
  FiFileText,
  FiDownload,
  FiTrash2,
  FiFile,
  FiCheckCircle,
} from "react-icons/fi";

import "./MeetingFiles.css";

function MeetingFiles({ meeting, onUpdated }) {
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const attachments = meeting?.attachments || [];

  // =========================
  // Upload
  // =========================

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      await uploadMeetingFile(meeting._id, file);

      toast.success("Document uploaded successfully");

      await onUpdated?.();
    } catch (error) {
      console.error("FILE UPLOAD ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);

      e.target.value = "";
    }
  };

  // =========================
  // Download
  // =========================

  const handleDownload = async (attachment) => {
    try {
      const response = await downloadMeetingFile(meeting._id, attachment._id);

      const blob = new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = attachment.fileName;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("DOWNLOAD ERROR:", error);

      toast.error("Failed to download file");
    }
  };

  // =========================
  // Delete
  // =========================

  const handleDelete = async (attachment) => {
    const confirmed = window.confirm(`Delete "${attachment.fileName}"?`);

    if (!confirmed) return;

    try {
      setDeletingId(attachment._id);

      await deleteMeetingFile(meeting._id, attachment._id);

      toast.success("Document deleted");

      await onUpdated?.();
    } catch (error) {
      console.error("DELETE FILE ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // File icon
  // =========================

  const getFileIcon = (filename = "") => {
    const extension = filename.split(".").pop()?.toLowerCase();

    if (
      extension === "pdf" ||
      extension === "doc" ||
      extension === "docx" ||
      extension === "txt"
    ) {
      return <FiFileText />;
    }

    return <FiFile />;
  };

  return (
    <section className="meeting-files-panel">
      {/* HEADER */}

      <div className="meeting-files-header">
        <div className="meeting-files-title">
          <div className="meeting-files-icon">
            <FiFileText />
          </div>

          <div>
            <h2>Meeting Documents</h2>

            <span>Upload and manage files related to this meeting.</span>
          </div>
        </div>

        <button
          type="button"
          className="meeting-upload-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <FiUploadCloud />

          {uploading ? "Uploading..." : "Upload Document"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
        />
      </div>

      {/* FILE LIST */}

      {attachments.length === 0 ? (
        <div className="meeting-files-empty">
          <FiUploadCloud />

          <h3>No documents yet</h3>

          <p>
            Upload PDFs, Word documents, text files, or other meeting materials.
          </p>

          <button type="button" onClick={() => fileInputRef.current?.click()}>
            <FiUploadCloud />
            Upload your first document
          </button>
        </div>
      ) : (
        <div className="meeting-files-list">
          {attachments.map((attachment) => (
            <div className="meeting-file-card" key={attachment._id}>
              <div className="meeting-file-left">
                <div className="meeting-file-type">
                  {getFileIcon(attachment.fileName)}
                </div>

                <div className="meeting-file-info">
                  <strong>{attachment.fileName}</strong>

                  <span>Document available to MeetMind AI</span>
                </div>

                <FiCheckCircle className="file-ready-icon" />
              </div>

              <div className="meeting-file-actions">
                <button
                  type="button"
                  onClick={() => handleDownload(attachment)}
                  title="Download"
                >
                  <FiDownload />
                  Download
                </button>

                <button
                  type="button"
                  className="delete-file-btn"
                  onClick={() => handleDelete(attachment)}
                  disabled={deletingId === attachment._id}
                  title="Delete"
                >
                  <FiTrash2 />

                  {deletingId === attachment._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI INFO */}

      {attachments.length > 0 && (
        <div className="meeting-files-ai-info">
          <FiCheckCircle />

          <div>
            <strong>Documents connected to MeetMind AI</strong>

            <span>
              Text extracted from supported documents can be used when
              generating summaries and answering meeting questions.
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

export default MeetingFiles;
