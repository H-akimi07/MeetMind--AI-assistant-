const fs = require("fs");

const Groq = require("groq-sdk");



const groq = new Groq({

  apiKey: process.env.GROQ_API_KEY,

});



const transcribeAudio = async (filePath) => {



  const response = await groq.audio.transcriptions.create({

    file: fs.createReadStream(filePath),

    model: "whisper-large-v3",

    response_format: "text",

  });



  return response;



};



module.exports = {

  transcribeAudio,

};