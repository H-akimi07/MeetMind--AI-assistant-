import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {Link,useNavigate} from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

import "./Login.css";

import API from "../api/axios";





function Login(){


const navigate=useNavigate();


const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const [error,setError]=useState("");

const [showPassword, setShowPassword] = useState(false);

const [loading, setLoading] = useState(false);

const [rememberMe, setRememberMe] = useState(false);

const handleLogin = async (e) => {

e.preventDefault();

setLoading(true);

setError("");

try{

// const res = await API.post(
// "/auth/login",
// {
// email,
// password,
// },
// );

const res = await API.post(
  "/auth/login",
  {
    email,
    password
  }
);


console.log("LOGIN RESPONSE:", res.data);



if (rememberMe) {

  localStorage.setItem(
    "token",
    res.data.token
  );

} else {

  sessionStorage.setItem(
    "token",
    res.data.token
  );

}

console.log("LOGIN RESPONSE:", res.data);

navigate("/dashboard");


}
catch(err){

setError(
err.response?.data?.message ||
"Login failed"
);

}
finally{

setLoading(false);

}

};


return (
  <AuthLayout
    title="Welcome Back"
    subtitle="Login to continue to MeetMind"
  >
    <form onSubmit={handleLogin} className="login-form">

      <div className="input-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label>Password</label>
        <div className="password-box">

<input

type={showPassword ? "text" : "password"}

placeholder="Enter your password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

required

/>

<button

type="button"

className="eye-btn"

onClick={()=>setShowPassword(!showPassword)}

>

{showPassword ?

<FaEyeSlash/>

:

<FaEye/>

}

</button>

</div>
      </div>

      {error && (
        <p className="auth-error">{error}</p>
      )}

     <div className="options-row">

<label className="remember">

<input

type="checkbox"

checked={rememberMe}

onChange={(e)=>setRememberMe(e.target.checked)}

/>

Remember me

</label>

<div className="forgot-row">

<Link to="/forgot-password">

Forgot Password?

</Link>

</div>

</div>
        <Link to="/forgot-password">
          Forgot Password?
        </Link>
    

      <button
  type="submit"
  className="login-btn"
>
  {loading ? "Signing In..." : "Login"}
</button>

      <div className="divider">
        <span>OR</span>
      </div>

      <button
        type="button"
        className="google-btn"
      >
        Continue with Google
      </button>

      <p className="switch-auth">
        Don't have an account?
        <Link to="/register"> Create one</Link>
      </p>

    </form>
  </AuthLayout>
);

}


export default Login;