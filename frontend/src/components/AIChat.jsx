import { useState } from "react";
import { askMeetingAI } from "../api/meeting";
import "./AIChat.css";
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
    <div className="ai-chat">
      <h2>🤖 MeetMind AI Assistant</h2>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.role === "user" ? "user-message" : "ai-message"}
          >
            {msg.text}
          </div>
        ))}

        {loading && <div className="ai-message">🤖 Thinking...</div>}
      </div>

      <div className="chat-input">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about this meeting..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendQuestion();
          }}
        />

        <button onClick={sendQuestion}>Send</button>
      </div>
    </div>
  );
}

export default AIChat;
