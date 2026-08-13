import { useState, useRef } from "react";
import API from "../api/axios";
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

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0",
    )}`;
  };

  return (
    <div className="bg-[#111] border border-[rgba(212,175,55,0.25)] p-[25px] rounded-[20px] mt-[30px]">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="block text-[#d4af37] text-[9px] font-bold tracking-[1.5px]">
            AI TRANSCRIPTION
          </span>

          <h3 className="text-[#d4af37] text-xl m-0 mt-2.5">Voice Recorder</h3>

          <p className="text-[#888] text-sm mt-2">
            Record your meeting and let MeetMind process the conversation.
          </p>
        </div>

        <div className="text-3xl">🎙️</div>
      </div>

      {/* RECORDING STATUS */}
      {recording && (
        <div className="flex items-center gap-2 mt-5 text-[#ff5555] font-bold text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5555]" />
          <span>Recording {formatTime(seconds)}</span>
        </div>
      )}

      {/* BUTTON */}
      {!recording ? (
        <button
          type="button"
          className="w-full p-[14px] rounded-xl border-none mt-[15px] cursor-pointer font-semibold bg-[#d4af37] text-black transition hover:bg-[#e1bd48]"
          onClick={startRecording}
        >
          🎤 Start Recording
        </button>
      ) : (
        <button
          type="button"
          className="w-full p-[14px] rounded-xl border-none mt-[15px] cursor-pointer font-semibold bg-[#c0392b] text-white transition hover:bg-[#d04432]"
          onClick={stopRecording}
        >
          ⏹ Stop Recording
        </button>
      )}

      {/* PREVIEW */}
      {audioURL && !recording && (
        <div className="mt-5">
          <p className="text-white text-sm">Recording ready</p>

          <audio controls src={audioURL} className="w-full mt-5" />

          <button
            type="button"
            className="w-full p-[14px] rounded-xl cursor-pointer font-semibold mt-[15px] bg-[#222] border border-[#d4af37] text-[#d4af37] transition hover:bg-[#2b2b2b]"
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
