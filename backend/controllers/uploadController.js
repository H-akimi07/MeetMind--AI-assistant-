const Meeting = require("../models/Meeting");
const extractFileText = require("../services/fileService");


const uploadMeetingFile = async(req,res)=>{

try{


const meeting = await Meeting.findById(
req.params.id
);


if(!meeting){

return res.status(404).json({

message:"Meeting not found"

});

}



const text = await extractFileText(
req.file
);



// save attachment info

meeting.attachments.push({

fileName:req.file.originalname,

fileUrl:`/uploads/${req.file.filename}`

});



// save extracted text

meeting.fileContents = 
(meeting.fileContents || "") 
+ "\n\n"
+ text;



await meeting.save();



res.json({

message:"File uploaded successfully",

meeting

});



}
catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}


};



module.exports={
uploadMeetingFile
};