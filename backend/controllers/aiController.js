const Meeting = require("../models/Meeting");

const {
  generateMeetingSummary,
  askMeetingQuestion,
} = require("../services/openaiService");



// ===============================
// Generate Meeting Summary
// ===============================

const generateSummary = async (req, res) => {

  try {


if(!req.params.id){

return res.status(400).json({

message:"Meeting ID is missing"

});

}


const meeting = await Meeting.findById(
req.params.id
);


    if (!meeting) {

      return res.status(404).json({
        message: "Meeting not found"
      });

    }



    // Check notes or uploaded files

    if (
      (!meeting.notes || meeting.notes.trim() === "") &&
      (!meeting.fileContents || meeting.fileContents.trim() === "")
    ) {

      return res.status(400).json({

        message:
        "Please add meeting notes or upload a file first."

      });

    }




    // Combine notes + files for AI

    const aiInput = `


Meeting Title:

${meeting.title || "No title"}



Meeting Description:

${meeting.description || "No description"}



Meeting Notes:

${meeting.notes || "No notes provided."}



Uploaded Documents:

${meeting.fileContents || "No documents uploaded."}


`;



    console.log(
      "AI INPUT LENGTH:",
      aiInput.length
    );




    const result = await generateMeetingSummary(
      aiInput
    );



    console.log(
      "AI RESULT:",
      result
    );




    meeting.summary =
      result.summary ||
      "Summary unavailable";



    meeting.keyPoints =
      result.keyPoints || [];



    meeting.actionItems =
      result.actionItems || [];



    meeting.decisions =
      result.decisions || [];



    meeting.deadlines =
      result.deadlines || [];





    await meeting.save();



    res.json(meeting);



  }

  catch(error){


    console.log(
      "SUMMARY ERROR:",
      error
    );


    res.status(500).json({

      message:error.message

    });


  }


};









// ===============================
// Ask AI About Meeting
// ===============================


const askMeetingAI = async(req,res)=>{


try{


const {
  question
} = req.body;



const meeting = await Meeting.findById(
req.params.id
);




if(!meeting){


return res.status(404).json({

message:"Meeting not found"

});


}




const context = `


Meeting Title:

${meeting.title || ""}



Description:

${meeting.description || ""}



Notes:

${meeting.notes || ""}



Uploaded Files:

${meeting.fileContents || ""}



Summary:

${meeting.summary || ""}



Key Points:

${meeting.keyPoints?.join("\n") || "None"}



Action Items:

${meeting.actionItems?.join("\n") || "None"}



Decisions:

${meeting.decisions?.join("\n") || "None"}



Deadlines:

${meeting.deadlines?.join("\n") || "None"}



`;





const answer = await askMeetingQuestion(
context,
question
);




res.json({

answer

});



}

catch(error){


console.log(
"CHAT ERROR:",
error
);



res.status(500).json({

message:error.message

});


}



};







module.exports = {


generateSummary,

askMeetingAI


};