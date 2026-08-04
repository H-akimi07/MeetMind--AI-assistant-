import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import "./ForgotPassword.css";

function ForgotPassword(){

const [email,setEmail]=useState("");

const handleSubmit = async(e)=>{

e.preventDefault();

try{

await API.post("/auth/forgot-password",{email});

toast.success("If this email exists, a reset link has been sent.");

}
catch{

toast.error("Something went wrong.");

}

};

return(

<div className="forgot-container">

<h2>Forgot Password</h2>

<form onSubmit={handleSubmit}>

<input
type="email"
placeholder="Enter your email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<button type="submit">

Send Reset Link

</button>

</form>

</div>

);

}

export default ForgotPassword;