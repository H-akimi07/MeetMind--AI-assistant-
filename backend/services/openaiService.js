const OpenAI = require("openai");


const client = new OpenAI({

apiKey: process.env.OPENROUTER_API_KEY,

baseURL:
"https://openrouter.ai/api/v1"

});



// ===========================
// Generate Meeting Summary
// ===========================
const generateMeetingSummary = async (notes) => {

try {


console.log("SUMMARY INPUT LENGTH:", notes.length);


const response = await client.chat.completions.create({

model: "meta-llama/llama-3.1-8b-instruct",


messages:[

{
role:"system",

content:`

You are MeetMind AI, a professional meeting assistant.

Read the meeting information.

Create a short summary.

Return ONLY JSON.

Format:

{
"summary":"short explanation",
"keyPoints":["point 1"],
"actionItems":["task 1"],
"decisions":["decision 1"],
"deadlines":["deadline 1"]
}


Rules:

- Do not copy the notes.
- Summary maximum 4 sentences.
- Extract only real information.
- If something does not exist, use empty arrays.

`

},

{
role:"user",
content:notes
}

]

});


let text = response.choices[0].message.content;


console.log(
"RAW AI SUMMARY:",
text
);


// Remove markdown and extra text
text = text
.replace(/```json/g, "")
.replace(/```/g, "")
.trim();


// Find JSON object
const start = text.indexOf("{");
const end = text.lastIndexOf("}") + 1;


if(start !== -1 && end !== -1){

text = text.substring(start,end);

}


return JSON.parse(text);

}
catch(error){

console.log(
"SUMMARY ERROR:",
error.message
);



return {

summary:"AI summary unavailable",

keyPoints:[],
actionItems:[],
decisions:[],
deadlines:[]

};


}

};







// ===========================
// Ask Meeting AI
// ===========================


const askMeetingQuestion = async(
context,
question
)=>{


try{


const response =
await client.chat.completions.create({



model:"qwen/qwen-2.5-7b-instruct",


temperature:0.7,



messages:[


{

role:"system",

content:`

You are MeetMind AI.

You are a friendly meeting assistant.

Rules:

- Answer meeting questions using only meeting data.
- If user says hello, salam, thanks, respond politely.
- You can have short natural conversations.
- Do not explain MeetMind.
- Do not answer programming questions.
- Keep answers short.

`

},



{

role:"user",

content:`

Meeting Information:

${context}


User:

${question}

`

}



]


});




return response
.choices[0]
.message
.content
.trim();



}


catch(error){


console.log(
"CHAT ERROR:",
error.message
);



return "Sorry, I couldn't answer that.";

}


};







module.exports={

generateMeetingSummary,

askMeetingQuestion

};