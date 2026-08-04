const fs = require("fs");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");


const extractFileText = async(file)=>{

try{


const fileType = file.mimetype;



// PDF files

if(fileType === "application/pdf"){


const dataBuffer = fs.readFileSync(
file.path
);


const data = await pdf(dataBuffer);


return data.text;


}



// DOCX files

if(
fileType === 
"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
){


const result = await mammoth.extractRawText({

path:file.path

});


return result.value;


}



// TXT files

if(fileType === "text/plain"){


return fs.readFileSync(
file.path,
"utf8"
);


}



return "";



}
catch(error){

console.log(
"FILE EXTRACTION ERROR:",
error
);


return "";

}


};



module.exports = extractFileText;