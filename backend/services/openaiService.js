const OpenAI = require("openai");

// OpenRouter Configuration

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

console.log("=================================");
console.log("🔐 MEETMIND AI CONFIGURATION");
console.log("=================================");

console.log("OPENROUTER_API_KEY EXISTS:", Boolean(OPENROUTER_API_KEY));

console.log(
  "OPENROUTER_API_KEY PREFIX:",
  OPENROUTER_API_KEY ? `${OPENROUTER_API_KEY.substring(0, 10)}...` : "MISSING",
);

console.log("OPENROUTER BASE URL:", "https://openrouter.ai/api/v1");

console.log("=================================");

if (!OPENROUTER_API_KEY) {
  console.error("❌ OPENROUTER_API_KEY is missing from environment variables");
}

const client = new OpenAI({
  apiKey: OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://meet-mind-ai-assistant.vercel.app",
    "X-Title": "MeetMind AI",
  },
});

// Generate Meeting Summary

const generateMeetingSummary = async (transcript) => {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured on the server");
    }

    if (!transcript || !transcript.trim()) {
      throw new Error("Meeting transcript is empty");
    }

    console.log("=================================");
    console.log("🧠 GENERATING MEETMIND AI SUMMARY");
    console.log("=================================");

    console.log("📝 Transcript length:", transcript.length);

    console.log("🔐 OpenRouter authentication:", "API key detected");

    const response = await client.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",

      temperature: 0.2,

      messages: [
        {
          role: "system",

          content: `
You are MeetMind AI, an expert professional meeting assistant.

You will receive the FULL TRANSCRIPT of a meeting.

Analyze the conversation carefully and return ONLY valid JSON.

Your response MUST follow exactly this structure:

{
  "summary": "A concise summary of the entire meeting.",
  "keyPoints": [
    "Important point discussed"
  ],
  "actionItems": [
    "Person or team should do something"
  ],
  "decisions": [
    "Decision that was actually made"
  ],
  "deadlines": [
    "Deadline or important date explicitly mentioned"
  ]
}

IMPORTANT RULES:

1. Use ONLY information contained in the transcript.
2. Do NOT invent facts.
3. Do NOT guess missing information.
4. Do NOT treat casual conversation as an action item.
5. Only include action items when someone actually needs to do something.
6. Only include decisions that were actually agreed upon.
7. Only include deadlines that were explicitly mentioned.
8. Extract the most important discussion points.
9. Keep the summary concise but informative.
10. The summary should be maximum 5 sentences.
11. If there are no action items, return [].
12. If there are no decisions, return [].
13. If there are no deadlines, return [].
14. If there are no important key points, return [].
15. Return ONLY JSON.
16. Do not use markdown.
`,
        },

        {
          role: "user",

          content: `
Here is the complete meeting transcript:

-------------------------
${transcript}
-------------------------

Analyze this meeting and return the required JSON.
`,
        },
      ],
    });

    let text = response?.choices?.[0]?.message?.content || "";

    console.log("=================================");
    console.log("🤖 RAW MEETMIND AI RESPONSE");
    console.log("=================================");
    console.log(text);

    if (!text) {
      throw new Error("OpenRouter returned an empty response");
    }

    // Remove markdown code fences
    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Find JSON object
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("AI did not return valid JSON");
    }

    text = text.substring(start, end + 1);

    const result = JSON.parse(text);

    console.log("=================================");
    console.log("✅ MEETMIND AI ANALYSIS COMPLETE");
    console.log("=================================");

    console.log("📄 Summary:", result.summary ? "YES" : "NO");

    console.log(
      "🔑 Key Points:",
      Array.isArray(result.keyPoints) ? result.keyPoints.length : 0,
    );

    console.log(
      "✅ Action Items:",
      Array.isArray(result.actionItems) ? result.actionItems.length : 0,
    );

    console.log(
      "📌 Decisions:",
      Array.isArray(result.decisions) ? result.decisions.length : 0,
    );

    console.log(
      "⏰ Deadlines:",
      Array.isArray(result.deadlines) ? result.deadlines.length : 0,
    );

    return {
      summary: typeof result.summary === "string" ? result.summary : "",

      keyPoints: Array.isArray(result.keyPoints) ? result.keyPoints : [],

      actionItems: Array.isArray(result.actionItems) ? result.actionItems : [],

      decisions: Array.isArray(result.decisions) ? result.decisions : [],

      deadlines: Array.isArray(result.deadlines) ? result.deadlines : [],
    };
  } catch (error) {
    console.error("=================================");
    console.error("❌ MEETMIND AI SUMMARY ERROR");
    console.error("=================================");

    console.error("Message:", error.message);

    if (error.status) {
      console.error("HTTP STATUS:", error.status);
    }

    if (error.code) {
      console.error("ERROR CODE:", error.code);
    }

    if (error.response?.data) {
      console.error(
        "API RESPONSE:",
        JSON.stringify(error.response.data, null, 2),
      );
    }

    return {
      summary: "",
      keyPoints: [],
      actionItems: [],
      decisions: [],
      deadlines: [],
    };
  }
};

// Ask Meeting AI

const askMeetingQuestion = async (context, question) => {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured on the server");
    }

    const response = await client.chat.completions.create({
      model: "qwen/qwen-2.5-7b-instruct",

      temperature: 0.7,

      messages: [
        {
          role: "system",

          content: `
You are MeetMind AI.

You are a friendly meeting assistant.

Rules:

- Answer meeting questions using only meeting data.
- If user says hello, salam, thanks, respond politely.
- You can have short natural conversations.
- Do not explain MeetMind.
- Do not answer programming questions.
- Keep answers short.
`,
        },

        {
          role: "user",

          content: `
Meeting Information:

${context}

User:

${question}
`,
        },
      ],
    });

    return (
      response?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't answer that."
    );
  } catch (error) {
    console.error("❌ CHAT ERROR:", error.message);

    if (error.status) {
      console.error("CHAT HTTP STATUS:", error.status);
    }

    if (error.response?.data) {
      console.error(
        "CHAT API RESPONSE:",
        JSON.stringify(error.response.data, null, 2),
      );
    }

    return "Sorry, I couldn't answer that.";
  }
};

// Export

module.exports = {
  generateMeetingSummary,
  askMeetingQuestion,
};
