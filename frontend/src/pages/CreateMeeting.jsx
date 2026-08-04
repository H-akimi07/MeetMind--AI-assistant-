import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createMeeting } from "../api/meeting";
import "./CreateMeeting.css";
import toast from "react-hot-toast";

function CreateMeeting(){

  const navigate = useNavigate();


  const [form,setForm] = useState({

    title:"",
    description:"",
    scheduledAt:"",
    duration:60,
    status:"scheduled"

  });



  const handleChange=(e)=>{

    setForm({

      ...form,

      [e.target.name]:e.target.value

    });

  };



  const handleCreate = async(e)=>{

    e.preventDefault();


    try{


      const res = await createMeeting(form);


      console.log(res.data);


      toast.success("Meeting created successfully!");


      navigate("/dashboard");


    }
    catch(error){


      console.log(error);


toast.error("Failed to create meeting");


    }

  };



return(

<div className="create-meeting-page">


<div className="create-meeting-card">


<h1>
Create New Meeting
</h1>


<form onSubmit={handleCreate}>


<input

type="text"

name="title"

placeholder="Meeting title"

value={form.title}

onChange={handleChange}

/>



<textarea

name="description"

placeholder="Meeting description"

value={form.description}

onChange={handleChange}

/>



<input

type="datetime-local"

name="scheduledAt"

value={form.scheduledAt}

onChange={handleChange}

/>



<input

type="number"

name="duration"

placeholder="Duration (minutes)"

value={form.duration}

onChange={handleChange}

/>



<select

name="status"

value={form.status}

onChange={handleChange}

>


<option value="scheduled">
Scheduled
</option>


<option value="live">
Live
</option>


<option value="completed">
Completed
</option>


<option value="cancelled">
Cancelled
</option>


</select>



<button className="create-btn">

Create Meeting

</button>


</form>


</div>


</div>

);


}


export default CreateMeeting;