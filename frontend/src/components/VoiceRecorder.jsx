import { useState, useRef } from "react";
import API from "../api/axios";
import "./VoiceRecorder.css";
import toast from "react-hot-toast";

function VoiceRecorder({ meetingId, onUploaded }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [uploading, setUploading] = useState(false);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

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
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();

      setRecording(true);
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      toast.success("Recording started");
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

  // UPLOAD AUDIO

  const uploadAudio = async () => {
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

      console.log("Uploading audio...");
      console.log("Meeting ID:", meetingId);
      console.log("Audio:", audioFile);

      const response = await API.post(`/meetings/${meetingId}/audio`, formData);

      console.log("AUDIO UPLOAD RESPONSE:", response.data);

      toast.success("Recording uploaded successfully!");

      // Tell MeetingDetails to reload the meeting
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

  // FORMAT TIME

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0",
    )}`;
  };

  // UI

  return (
    <div className="voice-box">
      <div className="voice-header">
        <div>
          <span className="voice-label">AI TRANSCRIPTION</span>

          <h3>Voice Recorder</h3>

          <p>Record your meeting and let MeetMind process the conversation.</p>
        </div>

        <div className="voice-icon">🎙️</div>
      </div>

      {recording && (
        <div className="recording-status">
          <span className="recording-dot"></span>

          <span>Recording {formatTime(seconds)}</span>
        </div>
      )}

      {!recording ? (
        <button type="button" className="start-record" onClick={startRecording}>
          🎤 Start Recording
        </button>
      ) : (
        <button type="button" className="stop-record" onClick={stopRecording}>
          ⏹ Stop Recording
        </button>
      )}

      {audioURL && !recording && (
        <div className="recording-preview">
          <p>Recording ready</p>

          <audio controls src={audioURL} />

          <button
            type="button"
            className="upload-record"
            onClick={uploadAudio}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Recording"}
          </button>
        </div>
      )}
    </div>
  );
}

export default VoiceRecorder;
