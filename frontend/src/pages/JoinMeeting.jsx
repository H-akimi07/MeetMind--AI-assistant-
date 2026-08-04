import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {joinMeeting} from "../api/meeting";
import toast from "react-hot-toast"; 

function JoinMeeting(){


const [code,setCode]=useState("");

const navigate=useNavigate();



const handleJoin=async()=>{


try{


const res = await joinMeeting(code);


navigate(
`/meeting/${res.data.meeting._id}`
);


}
catch(error){

console.log(error);


toast.error("Meeting not found");

}


};



return(

<div>


<h1>
Join Meeting
</h1>


<input

placeholder="Enter meeting code"

value={code}

onChange={(e)=>setCode(e.target.value)}

/>


<button
onClick={handleJoin}
>

Join Meeting

</button>


</div>

);


}


export default JoinMeeting;