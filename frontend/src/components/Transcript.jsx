import { useRef, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

import {
  FiMic,
  FiSquare,
  FiUploadCloud,
  FiPlay,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiTrash2,
} from "react-icons/fi";

function Transcript({ meetingId, onUploaded }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [transcript, setTranscript] = useState("");

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const formatTime = (value) => {
    const minutes = Math.floor(value / 60);
    const secondsLeft = value % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secondsLeft).padStart(
      2,
      "0",
    )}`;
  };

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

  const clearRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }

    setAudioURL("");
    setAudioFile(null);
    setSeconds(0);
  };

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

      const response = await API.post(`/meetings/${meetingId}/audio`, formData);

      console.log("AUDIO RESPONSE:", response.data);

      const returnedTranscript =
        response.data?.transcript ||
        response.data?.transcription ||
        response.data?.text ||
        "";

      if (returnedTranscript) {
        setTranscript(returnedTranscript);
      }

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

  return (
    <section className="w-full p-0 rounded-[18px] bg-[#212121ac] border border-[rgba(255,255,255,0.08)] text-white box-border overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 px-5 py-[18px] border-b border-[rgba(255,255,255,0.07)] max-[700px]:items-start max-[700px]:flex-col">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-[10px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white text-lg">
            <FiFileText />
          </div>

          <div>
            <span className="block mb-[3px] text-[rgba(255,255,255,0.55)] text-[8px] font-extrabold tracking-[1.4px]">
              MEETING INTELLIGENCE
            </span>

            <h2 className="m-0 text-white text-base font-normal">
              Transcript & Recording
            </h2>

            <p className="mt-1 text-[rgba(255,255,255,0.45)] text-[10px] leading-[1.4]">
              Record your meeting and turn your conversation into useful
              AI-powered insights.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-[6px] px-[9px] py-[6px] rounded-[20px] bg-[rgba(255,255,255,0.035)] border border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.55)] text-[10px] max-[700px]:self-start">
          <span
            className={`w-[6px] h-[6px] rounded-full ${
              recording
                ? "bg-[#e74c3c] shadow-[0_0_0_4px_rgba(231,76,60,0.08)]"
                : "bg-[#666]"
            }`}
          />

          {recording ? "Recording" : "Ready"}
        </div>
      </div>

      {/* RECORDER */}
      <div className="flex items-center justify-between gap-[14px] mx-5 mt-[18px] p-[13px_15px] rounded-[13px] bg-[rgba(255,255,255,0.035)] border border-[rgba(255,255,255,0.07)] box-border max-[700px]:items-stretch max-[700px]:flex-col">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-[10px] border text-base ${
              recording
                ? "bg-[rgba(231,76,60,0.12)] border-[rgba(231,76,60,0.25)] text-[#ef6b5d]"
                : "bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.08)] text-white"
            }`}
          >
            <FiMic />
          </div>

          <div className="min-w-0">
            <h3 className="m-0 text-white text-xs font-bold">
              {recording ? "Recording meeting..." : "Ready to record"}
            </h3>

            <p className="mt-[3px] text-[rgba(255,255,255,0.42)] text-[9px]">
              {recording
                ? "MeetMind is capturing your conversation."
                : "Start recording to capture your meeting."}
            </p>
          </div>
        </div>

        {recording && (
          <div className="flex items-center justify-center gap-[5px] text-[#ef6b5d] text-[10px] font-bold whitespace-nowrap">
            <span className="w-[5px] h-[5px] rounded-full bg-[#ef6b5d]" />
            <FiClock />
            {formatTime(seconds)}
          </div>
        )}

        {!recording ? (
          <button
            type="button"
            className="inline-flex items-center justify-center gap-[6px] h-8 px-[13px] rounded-lg cursor-pointer text-[10px] font-bold whitespace-nowrap bg-[#d4af37] text-[#080808] border-none transition-all duration-200 hover:bg-[#e1bd48] hover:-translate-y-px max-[700px]:w-full"
            onClick={startRecording}
          >
            <FiMic />
            Start Recording
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex items-center justify-center gap-[6px] h-8 px-[13px] rounded-lg cursor-pointer text-[10px] font-bold whitespace-nowrap bg-[rgba(231,76,60,0.1)] border border-[rgba(231,76,60,0.25)] text-[#ef6b5d] transition-all duration-200 hover:bg-[rgba(231,76,60,0.16)] max-[700px]:w-full"
            onClick={stopRecording}
          >
            <FiSquare />
            Stop
          </button>
        )}
      </div>

      {/* RECORDING RESULT */}
      {audioURL && !recording && (
        <div className="mx-5 mt-2.5 p-[13px] rounded-[13px] bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between mb-[9px]">
            <div className="flex items-center gap-[9px]">
              <div className="w-[30px] h-[30px] flex items-center justify-center rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.06)] text-white text-[13px]">
                <FiPlay />
              </div>

              <div>
                <h3 className="m-0 text-white text-[11px]">Recording Ready</h3>

                <p className="mt-0.5 text-[rgba(255,255,255,0.42)] text-[8px]">
                  Listen before sending it to MeetMind.
                </p>
              </div>
            </div>

            <FiCheckCircle className="text-[#4caf50] text-sm" />
          </div>

          <audio
            controls
            src={audioURL}
            className="block w-full h-[34px] mb-[9px]"
          />

          <div className="flex gap-[7px] max-[700px]:flex-col">
            <button
              type="button"
              className="flex-1 h-[30px] flex items-center justify-center gap-[5px] rounded-[7px] cursor-pointer text-[9px] font-bold bg-[rgba(255,255,255,0.045)] border border-[rgba(255,255,255,0.09)] text-white transition hover:bg-[rgba(255,255,255,0.08)]"
              onClick={uploadRecording}
              disabled={uploading}
            >
              <FiUploadCloud />
              {uploading ? "Processing..." : "Upload & Transcribe"}
            </button>

            <button
              type="button"
              className="h-[30px] px-[11px] flex items-center justify-center gap-[5px] rounded-[7px] cursor-pointer text-[9px] font-bold bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] transition hover:text-[#ef6b5d] hover:border-[rgba(231,76,60,0.2)] max-[700px]:w-full"
              onClick={clearRecording}
              disabled={uploading}
            >
              <FiTrash2 />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* TRANSCRIPT */}
      <div className="mx-5 mt-2.5 mb-5 p-[14px] rounded-[13px] bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="block text-[rgba(255,255,255,0.45)] text-[7px] font-extrabold tracking-[1.3px]">
              TRANSCRIPT
            </span>

            <h3 className="mt-[3px] mb-0 text-white text-xs">
              Meeting Conversation
            </h3>
          </div>

          {transcript && (
            <div className="flex items-center gap-1 text-[#4caf50] text-[8px]">
              <FiCheckCircle />
              Ready
            </div>
          )}
        </div>

        {transcript ? (
          <div className="max-h-[220px] overflow-y-auto p-[11px] rounded-[9px] bg-[rgba(0,0,0,0.12)] border border-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.72)] text-[10px] leading-[1.7] whitespace-pre-wrap">
            {transcript}
          </div>
        ) : (
          <div className="min-h-[70px] flex flex-col items-center justify-center text-center">
            <div className="w-[30px] h-[30px] flex items-center justify-center mb-[6px] rounded-lg bg-[rgba(255,255,255,0.045)] border border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.5)] text-[13px]">
              <FiFileText />
            </div>

            <h4 className="m-0 text-[rgba(255,255,255,0.7)] text-[10px]">
              No transcript yet
            </h4>

            <p className="mt-[3px] text-[rgba(255,255,255,0.38)] text-[8px]">
              Record and upload your meeting to generate the conversation
              transcript.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Transcript;
