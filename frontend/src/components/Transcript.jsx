import { useRef, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

import {
  FiMic,
  FiSquare,
  FiUploadCloud,
  FiPlay,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  FiFileText,
} from "react-icons/fi";

import "./Transcript.css";

function Transcript({ meetingId, onUploaded }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [uploading, setUploading] = useState(false);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // FORMAT TIME

  const formatTime = (value) => {
    const minutes = Math.floor(value / 60);
    const secondsLeft = value % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secondsLeft).padStart(
      2,
      "0",
    )}`;
  };

  // START RECORDING

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        toast.error("Your browser does not support microphone recording.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        const file = new File([blob], "meeting-recording.webm", {
          type: "audio/webm",
        });

        setAudioFile(file);
        setAudioURL(URL.createObjectURL(blob));

        // Stop microphone
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      };

      recorder.start();

      setRecording(true);
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("RECORDING ERROR:", error);

      toast.error("Microphone permission is required to record.");
    }
  };

  // STOP RECORDING

  const stopRecording = () => {
    if (!recorderRef.current) return;

    if (recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }

    setRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // CLEAR RECORDING

  const clearRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }

    setAudioURL("");
    setAudioFile(null);
    setSeconds(0);
  };

  // UPLOAD RECORDING + TRANSCRIBE

  const uploadRecording = async () => {
    if (!audioFile) {
      toast.error("Please record something first.");
      return;
    }

    if (!meetingId) {
      toast.error("Meeting ID is missing.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("audio", audioFile);

      console.log("Uploading meeting audio...");
      console.log("Meeting ID:", meetingId);
      console.log("Audio file:", audioFile);

      // Do NOT manually set Content-Type.
      // Axios/browser automatically adds the correct multipart boundary.
      const response = await API.post(`/meetings/${meetingId}/audio`, formData);

      console.log("AUDIO RESPONSE:", response.data);

      /*
       * The backend is still responsible for:
       *
       * Audio
       *   ↓
       * Transcript
       *   ↓
       * AI Summary
       *   ↓
       * Save to database
       *
       * We don't need to display the transcript here.
       */

      toast.success("Recording uploaded and transcribed successfully!");

      /*
       * Tell the parent component that processing is complete.
       *
       * The parent can refresh the meeting data and display
       * the transcript/summary wherever you want.
       */
      if (onUploaded) {
        onUploaded(response.data);
      }
    } catch (error) {
      console.error("AUDIO UPLOAD ERROR:", error.response?.data || error);

      toast.error(
        error.response?.data?.message || "Failed to upload recording.",
      );
    } finally {
      setUploading(false);
    }
  };

  // UI

  return (
    <section className="transcript-section">
      {/* ================= HEADER ================= */}

      <div className="transcript-header">
        <div className="transcript-heading">
          <div className="transcript-title-icon">
            <FiFileText />
          </div>

          <div>
            <span className="transcript-eyebrow">MEETING INTELLIGENCE</span>

            <h2>Transcript & Recording</h2>

            <p>
              Record your meeting and turn your conversation into useful
              AI-powered insights.
            </p>
          </div>
        </div>

        <div className="transcript-status">
          <span className={recording ? "status-dot recording" : "status-dot"} />

          {recording ? "Recording" : "Ready"}
        </div>
      </div>

      {/* ================= RECORDER ================= */}

      <div className="recorder-panel">
        <div className="recorder-main">
          <div
            className={recording ? "microphone-orb active" : "microphone-orb"}
          >
            <FiMic />
          </div>

          <div className="recorder-text">
            <h3>{recording ? "Recording meeting..." : "Ready to record"}</h3>

            <p>
              {recording
                ? "MeetMind is capturing your conversation."
                : "Start recording to capture your meeting."}
            </p>
          </div>
        </div>

        {/* ================= TIMER ================= */}

        {recording && (
          <div className="recording-timer">
            <span className="timer-pulse" />

            <FiClock />

            {formatTime(seconds)}
          </div>
        )}

        {/* ================= RECORD BUTTON ================= */}

        {!recording ? (
          <button
            type="button"
            className="transcript-record-btn"
            onClick={startRecording}
            disabled={uploading}
          >
            <FiMic />
            Start Recording
          </button>
        ) : (
          <button
            type="button"
            className="transcript-stop-btn"
            onClick={stopRecording}
            disabled={uploading}
          >
            <FiSquare />
            Stop
          </button>
        )}
      </div>

      {/* ================= RECORDING PREVIEW ================= */}

      {audioURL && !recording && (
        <div className="recording-result">
          <div className="recording-result-header">
            <div className="result-title">
              <div className="result-icon">
                <FiPlay />
              </div>

              <div>
                <h3>Recording Ready</h3>

                <p>Listen before sending it to MeetMind.</p>
              </div>
            </div>

            <FiCheckCircle className="ready-icon" />
          </div>

          <audio controls src={audioURL} className="transcript-audio" />

          <div className="recording-actions">
            <button
              type="button"
              className="upload-transcript-btn"
              onClick={uploadRecording}
              disabled={uploading}
            >
              <FiUploadCloud />

              {uploading ? "Processing..." : "Upload & Transcribe"}
            </button>

            <button
              type="button"
              className="clear-recording-btn"
              onClick={clearRecording}
              disabled={uploading}
            >
              <FiTrash2 />
              Clear
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Transcript;
