import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock
} from "react-icons/fi";
import {
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import { motion } from "framer-motion";

import API from "../api/axios";
import "./Register.css";

function Register() {

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const [showPassword,setShowPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);

  const [acceptTerms,setAcceptTerms] = useState(false);

  const [loading,setLoading] = useState(false);

  const [error,setError] = useState("");

  const getStrength = () => {

    if(password.length < 6) return "Weak";

    if(
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password)
    ){
      return "Strong";
    }

    return "Medium";

  };

  const handleSignup = async(e)=>{

    e.preventDefault();

    setError("");

    if(password !== confirmPassword){

      setError("Passwords do not match.");

      return;

    }

    if(!acceptTerms){

      setError("Please accept the Terms & Privacy Policy.");

      return;

    }

    try{

      setLoading(true);

      const res = await API.post(
        "/auth/register",
        {
          name,
          email,
          password
        }
      );

      if(res.data.token){

        localStorage.setItem(
          "token",
          res.data.token
        );

        navigate("/dashboard");

      }else{

        navigate("/login");

      }

    }
   catch(err){

console.log("REGISTER ERROR:", err);

console.log("RESPONSE:", err.response);

console.log("DATA:", err.response?.data);

console.log("MESSAGE:", err.message);

setError(

err.response?.data?.message ||

err.message ||

"Registration failed."

);

}
    finally{

      setLoading(false);

    }

  };

  return (

<div className="signup-page">

<div className="background-glow glow1"></div>

<div className="background-glow glow2"></div>

<div className="signup-left">

<div className="logo">

<span>Meet</span>Mind

</div>

<h1>

Join the Future of

<span> AI Meetings</span>

</h1>

<p>

Transform meetings into AI-powered summaries,

tasks, decisions and collaboration.

</p>

<div className="stats">

<div className="stat">

<h2>🤖</h2>

<span>AI Summaries</span>

</div>

<div className="stat">

<h2>⚡</h2>

<span>Instant Insights</span>

</div>

<div className="stat">

<h2>🔒</h2>

<span>Secure Meetings</span>

</div>

</div>

</div>

<motion.form

className="signup-card"

onSubmit={handleSignup}

initial={{opacity:0,y:40}}

animate={{opacity:1,y:0}}

transition={{duration:.7}}

>

<h2>Create Account</h2>

<div className="input-box">

<FiUser/>

<input

type="text"

placeholder="Full Name"

value={name}

onChange={(e)=>setName(e.target.value)}

required

/>

</div>

<div className="input-box">

<FiMail/>

<input

type="email"

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

required

/>

</div>

<div className="input-box">

<FiLock/>

<input

type={showPassword ? "text":"password"}

placeholder="Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

required

/>

<button

type="button"

className="eye-btn"

onClick={()=>setShowPassword(!showPassword)}

>

{showPassword ? <FaEyeSlash/> : <FaEye/>}

</button>

</div>

<div className="strength">

Strength:

<span className={getStrength().toLowerCase()}>

{getStrength()}

</span>

</div>

<div className="input-box">

<FiLock/>

<input

type={showConfirmPassword ? "text":"password"}

placeholder="Confirm Password"

value={confirmPassword}

onChange={(e)=>setConfirmPassword(e.target.value)}

required

/>

<button

type="button"

className="eye-btn"

onClick={()=>setShowConfirmPassword(!showConfirmPassword)}

>

{showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}

</button>

</div>

<label className="terms">

<input

type="checkbox"

checked={acceptTerms}

onChange={(e)=>setAcceptTerms(e.target.checked)}

/>

I agree to the Terms & Privacy Policy

</label>

{error &&

<p className="auth-error">

{error}

</p>

}

<button

type="submit"

disabled={loading}

>

{

loading ?

"Creating Account..."

:

"Create Account"

}

</button>

<div className="divider">

OR

</div>

<button

type="button"

className="google"

disabled

>

Google Sign-In

<span>

Coming Soon

</span>

</button>

<p className="signin">

Already have an account?

<Link to="/login">

Sign In

</Link>

</p>

</motion.form>

</div>

  );

}

export default Register;