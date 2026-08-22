const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,

  baseURL: "https://openrouter.ai/api/v1",
});

// Generate Meeting Summary
const generateMeetingSummary = async (transcript) => {
  try {
    if (!transcript || !transcript.trim()) {
      throw new Error("Meeting transcript is empty");
    }

    console.log(
      "🧠 MeetMind AI processing transcript:",
      transcript.length,
      "characters",
    );

    const response = await client.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",

      temperature: 0.2,

      messages: [
        {
          role: "system",

          content: `
You are MeetMind AI, an intelligent professional meeting assistant.

You will receive the COMPLETE transcript of a meeting.

Analyze the conversation carefully and extract only information that is actually supported by the transcript.

Return ONLY valid JSON.

Required format:

{
  "summary": "A concise summary of the entire meeting.",
  "keyPoints": [
    "Important point discussed"
  ],
  "actionItems": [
    "Task that someone needs to complete"
  ],
  "decisions": [
    "Decision that was made"
  ],
  "deadlines": [
    "Deadline or due date mentioned"
  ]
}

IMPORTANT RULES:

1. Base everything ONLY on the transcript.
2. Do NOT invent information.
3. Do NOT guess names, dates, tasks, or decisions.
4. Summary must be maximum 4 sentences.
5. keyPoints should contain the most important topics discussed.
6. actionItems should contain actual tasks or responsibilities.
7. decisions should contain decisions that were actually made.
8. deadlines should contain actual dates, times, or deadlines mentioned.
9. If there are no action items, return [].
10. If there are no decisions, return [].
11. If there are no deadlines, return [].
12. Return valid JSON only.
13. Do not use markdown.
14. Do not include explanations outside the JSON.
`,
        },

        {
          role: "user",

          content: `
Here is the complete meeting transcript:

${transcript}
`,
        },
      ],
    });

    let text = response.choices?.[0]?.message?.content || "";

    console.log("RAW MEETMIND AI RESPONSE:");
    console.log(text);

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;

    if (start === -1 || end <= start) {
      throw new Error("AI did not return valid JSON");
    }

    text = text.substring(start, end);

    const result = JSON.parse(text);

    return {
      summary: result.summary || "",

      keyPoints: Array.isArray(result.keyPoints) ? result.keyPoints : [],

      actionItems: Array.isArray(result.actionItems) ? result.actionItems : [],

      decisions: Array.isArray(result.decisions) ? result.decisions : [],

      deadlines: Array.isArray(result.deadlines) ? result.deadlines : [],
    };
  } catch (error) {
    console.error("❌ MEETMIND AI SUMMARY ERROR:", error.message);

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

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.log("CHAT ERROR:", error.message);

    return "Sorry, I couldn't answer that.";
  }
};

module.exports = {
  generateMeetingSummary,

  askMeetingQuestion,
};
