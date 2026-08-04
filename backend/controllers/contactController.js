const nodemailer = require("nodemailer");

const sendMessage = async (req,res)=>{

try{

const {name,email,subject,message}=req.body;

const transporter = nodemailer.createTransport({

service:"gmail",

auth:{

user:process.env.EMAIL_USER,
pass:process.env.EMAIL_PASS

}

});

await transporter.sendMail({

from: `"${name}" <${process.env.EMAIL_USER}>`,
replyTo: email,

to:process.env.EMAIL_USER,

subject:`MeetMind Contact: ${subject}`,

html:`

<h2>New Contact Message</h2>

<p><b>Name:</b> ${name}</p>

<p><b>Email:</b> ${email}</p>

<p><b>Subject:</b> ${subject}</p>

<p>${message}</p>

`

});

res.json({

message:"Email sent successfully"

});

}
catch(error){

res.status(500).json({

message:error.message

});

}

};

module.exports={
sendMessage
};