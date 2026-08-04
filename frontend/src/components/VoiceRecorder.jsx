import { useState, useRef } from "react";
import API from "../api/axios";
import "./VoiceRecorder.css";
import toast from "react-hot-toast";

function VoiceRecorder({meetingId}){


const [recording,setRecording]=useState(false);

const [audioURL,setAudioURL]=useState("");

const [audioFile,setAudioFile]=useState(null);

const [seconds,setSeconds]=useState(0);


const recorderRef = useRef(null);

const chunksRef = useRef([]);

const timerRef = useRef(null);



const startRecording = async()=>{


const stream =
await navigator.mediaDevices.getUserMedia({
audio:true
});


const recorder =
new MediaRecorder(stream);


recorderRef.current = recorder;


chunksRef.current=[];



recorder.ondataavailable=(e)=>{

chunksRef.current.push(e.data);

};



recorder.onstop=()=>{


const blob =
new Blob(
chunksRef.current,
{
type:"audio/webm"
}
);


const file =
new File(
[blob],
"meeting-recording.webm",
{
type:"audio/webm"
}
);



setAudioFile(file);


setAudioURL(
URL.createObjectURL(blob)
);



};



recorder.start();


setRecording(true);


setSeconds(0);


timerRef.current=setInterval(()=>{

setSeconds(prev=>prev+1);

},1000);



};



const stopRecording=()=>{


recorderRef.current.stop();


setRecording(false);


clearInterval(timerRef.current);


};



const uploadAudio=async()=>{


if(!audioFile)
return;



const formData =
new FormData();


formData.append(
"audio",
audioFile
);



await API.post(

`/meetings/${meetingId}/audio`,

formData,

{

headers:{

"Content-Type":
"multipart/form-data"

}

}

);

toast.success("Audio uploaded successfully");

};



return (

<div className="voice-box">


<h3>
AI Voice Recorder
</h3>


{
recording &&

<p className="timer">

Recording:
{seconds}s

</p>

}



{
!recording ?

<button
className="start-record"
onClick={startRecording}
>

🎤 Start Recording

</button>

:

<button
className="stop-record"
onClick={stopRecording}
>

🟥 Stop Recording

</button>

}



{
audioURL &&

<>

<audio
controls
src={audioURL}
/>


<button
className="upload-record"
onClick={uploadAudio}
>

Upload Recording

</button>

</>

}


</div>

);


}


export default VoiceRecorder;