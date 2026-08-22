const OpenAI = require("openai");

if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ OPENROUTER_API_KEY is missing!");
} else {
  console.log("✅ OPENROUTER_API_KEY is loaded");
  console.log(
    "🔑 Key prefix:",
    process.env.OPENROUTER_API_KEY.substring(0, 10) + "...",
  );
}

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// Generate MeetMind AI Analysis
// const generateMeetingSummary = async (transcript) => {
//   try {
//     if (!transcript || !transcript.trim()) {
//       throw new Error("Meeting transcript is empty");
//     }

//     console.log("🧠 MEETMIND AI - TRANSCRIPT LENGTH:", transcript.length);

//     const response = await client.chat.completions.create({
//       model: "meta-llama/llama-3.1-8b-instruct",

//       temperature: 0.2,

//       messages: [
//         {
//           role: "system",

//           content: `
// You are MeetMind AI, an expert professional meeting assistant.

// You will receive the FULL TRANSCRIPT of a meeting.

// Analyze the conversation carefully and return ONLY valid JSON.

// Your response MUST follow exactly this structure:

// {
//   "summary": "A concise summary of the entire meeting.",
//   "keyPoints": [
//     "Important point discussed"
//   ],
//   "actionItems": [
//     "Person or team should do something"
//   ],
//   "decisions": [
//     "Decision that was actually made"
//   ],
//   "deadlines": [
//     "Deadline or important date explicitly mentioned"
//   ]
// }

// IMPORTANT RULES:

// 1. Use ONLY information contained in the transcript.
// 2. Do NOT invent facts.
// 3. Do NOT guess missing information.
// 4. Do NOT treat casual conversation as an action item.
// 5. Only include action items when someone actually needs to do something.
// 6. Only include decisions that were actually agreed upon.
// 7. Only include deadlines that were explicitly mentioned.
// 8. Extract the most important discussion points.
// 9. Keep the summary concise but informative.
// 10. The summary should be maximum 5 sentences.
// 11. If there are no action items, return [].
// 12. If there are no decisions, return [].
// 13. If there are no deadlines, return [].
// 14. If there are no important key points, return [].
// 15. Return ONLY JSON. Do not use markdown.
// `,
//         },

//         {
//           role: "user",

//           content: `
// Here is the complete meeting transcript:

// -------------------------
// ${transcript}
// -------------------------

// Analyze this meeting and return the required JSON.
// `,
//         },
//       ],
//     });

//     let text = response?.choices?.[0]?.message?.content || "";

//     console.log("🤖 RAW MEETMIND AI RESPONSE:");
//     console.log(text);

//     // Remove markdown code fences if model adds them
//     text = text
//       .replace(/```json/gi, "")
//       .replace(/```/g, "")
//       .trim();

//     // Find JSON object
//     const start = text.indexOf("{");
//     const end = text.lastIndexOf("}");

//     if (start === -1 || end === -1) {
//       throw new Error("AI did not return valid JSON");
//     }

//     text = text.substring(start, end + 1);

//     const result = JSON.parse(text);

//     return {
//       summary: typeof result.summary === "string" ? result.summary : "",

//       keyPoints: Array.isArray(result.keyPoints) ? result.keyPoints : [],

//       actionItems: Array.isArray(result.actionItems) ? result.actionItems : [],

//       decisions: Array.isArray(result.decisions) ? result.decisions : [],

//       deadlines: Array.isArray(result.deadlines) ? result.deadlines : [],
//     };
//   } catch (error) {
//     console.error("❌ MEETMIND AI SUMMARY ERROR:", error.message);

//     return {
//       summary: "",
//       keyPoints: [],
//       actionItems: [],
//       decisions: [],
//       deadlines: [],
//     };
//   }
// };

// ===========================
// Generate MeetMind AI Analysis
// ===========================
const generateMeetingSummary = async (transcript) => {
  try {
    if (!transcript || !transcript.trim()) {
      throw new Error("Meeting transcript is empty");
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
15. Return ONLY JSON. Do not use markdown.
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

    // Remove markdown code fences if model adds them
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

    return {
      summary: typeof result.summary === "string" ? result.summary : "",

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
