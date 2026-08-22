const OpenAI = require("openai");

/*
OPENROUTER CONFIGURATION
*/

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error("❌ OPENROUTER_API_KEY is missing!");
} else {
  console.log("✅ OPENROUTER_API_KEY is loaded");
  console.log("🔑 Key prefix:", apiKey.substring(0, 10) + "...");
}

/*
OPENROUTER CLIENT
*/

const client = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://openrouter.ai/api/v1",

  defaultHeaders: {
    "HTTP-Referer": "https://meet-mind-ai-assistant.vercel.app",
    "X-Title": "MeetMind AI",
  },
});

/*
GENERATE MEETING AI ANALYSIS
*/

const generateMeetingSummary = async (transcript) => {
  try {
    if (!transcript || !transcript.trim()) {
      throw new Error("Meeting transcript is empty");
    }

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is missing");
    }

    console.log("🧠 MEETMIND AI - TRANSCRIPT LENGTH:", transcript.length);

    const response = await client.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",

      temperature: 0.2,

      messages: [
        {
          role: "system",

          content: `
You are MeetMind AI, an expert professional meeting assistant.

You will receive the FULL TRANSCRIPT of a meeting.

Analyze the conversation carefully.

Return ONLY valid JSON.

Your response MUST follow exactly this structure:

{
  "summary": "A concise but informative summary of the entire meeting.",
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
2. NEVER invent facts.
3. NEVER guess missing information.
4. Do not treat greetings or casual conversation as important points.
5. Only include genuine action items.
6. Only include decisions that were actually agreed upon.
7. Only include deadlines explicitly mentioned.
8. Extract the most important discussion points.
9. Make the summary concise but informative.
10. The summary must be maximum 5 sentences.
11. If there are no action items, return [].
12. If there are no decisions, return [].
13. If there are no deadlines, return [].
14. If there are no important key points, return [].
15. Preserve important details from the transcript.
16. Return ONLY JSON.
17. Do NOT use markdown.
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

    console.log("🤖 RAW MEETMIND AI RESPONSE:");
    console.log(text);

    /*
    Remove markdown code fences
    */

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    /*
    Find JSON object
    */

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("AI did not return valid JSON");
    }

    text = text.substring(start, end + 1);

    const result = JSON.parse(text);

    console.log("✅ MEETMIND AI JSON PARSED SUCCESSFULLY");

    return {
      summary: typeof result.summary === "string" ? result.summary : "",

      keyPoints: Array.isArray(result.keyPoints) ? result.keyPoints : [],

      actionItems: Array.isArray(result.actionItems) ? result.actionItems : [],

      decisions: Array.isArray(result.decisions) ? result.decisions : [],

      deadlines: Array.isArray(result.deadlines) ? result.deadlines : [],
    };
  } catch (error) {
    console.error("❌ MEETMIND AI SUMMARY ERROR:", error.message);

    if (error.status) {
      console.error("AI STATUS:", error.status);
    }

    if (error.response?.data) {
      console.error(
        "AI RESPONSE:",
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

/*
ASK MEETING AI
*/

const askMeetingQuestion = async (context, question) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is missing");
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

- Answer questions using only the meeting information.
- If the user says hello, salam, or thanks, respond politely.
- Do not invent meeting information.
- Do not answer unrelated programming questions.
- Keep answers short and useful.
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

    return "Sorry, I couldn't answer that.";
  }
};

/*
EXPORTS
*/

module.exports = {
  generateMeetingSummary,
  askMeetingQuestion,
};
