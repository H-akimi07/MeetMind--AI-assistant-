import { useState } from "react";
import { askMeetingAI } from "../api/meeting";
import toast from "react-hot-toast";

function AIChat({ meetingId }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    setQuestion("");
    setLoading(true);

    try {
      const res = await askMeetingAI(meetingId, userMessage.text);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: res.data.answer,
        },
      ]);
    } catch (error) {
      toast.error("Something went wrong!");

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, I couldn't answer that.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[30px] rounded-[20px] border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(145deg,#111,#1b1b1b)] p-[25px] text-white">
      <h2 className="mb-5 text-[#d4af37]">🤖 MeetMind AI Assistant</h2>

      <div className="mb-5 flex h-[300px] flex-col gap-[15px] overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.role === "user"
                ? "max-w-[70%] self-end rounded-[15px] bg-[#d4af37] px-4 py-3 text-[#111]"
                : "max-w-[70%] self-start rounded-[15px] border border-[rgba(212,175,55,0.2)] bg-[#222] px-4 py-3 text-white"
            }
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="max-w-[70%] self-start rounded-[15px] border border-[rgba(212,175,55,0.2)] bg-[#222] px-4 py-3 text-white">
            🤖 Thinking...
          </div>
        )}
      </div>

      <div className="flex gap-[10px]">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about this meeting..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendQuestion();
          }}
          className="min-w-0 flex-1 rounded-[12px] border border-[rgba(212,175,55,0.3)] bg-[#080808] p-[14px] text-white outline-none"
        />

        <button
          onClick={sendQuestion}
          className="cursor-pointer rounded-[12px] border-none bg-[#d4af37] px-[25px] py-3 font-bold transition duration-300 hover:-translate-y-0.5"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default AIChat;
