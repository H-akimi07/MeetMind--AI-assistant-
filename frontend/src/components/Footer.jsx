import "./Footer.css";
import logo from "../assets/meetmind-logo.svg";
import { Link } from "react-router-dom";

export default function Footer(){

return(

<footer className="footer" id="contact">

<div className="footer-top">

<div>

<img src={logo} className="footer-logo"/>

<p>

MeetMind is your AI Meeting Assistant that transforms notes, recordings and documents into summaries and action items.

</p>

</div>

<div>

<h4>Product</h4>

<Link to="/">Home</Link>

<Link to="/login">Login</Link>

<Link to="/register">Sign Up</Link>

</div>

<div>

<h4>Resources</h4>

<a href="#features">Features</a>

<a href="#pricing">Pricing</a>

<a href="#how">How it Works</a>

</div>

<div>

<h4>Contact</h4>

<p>support@meetmind.ai</p>

<p>Herat, Afghanistan</p>

</div>

</div>

<div className="footer-bottom">

© 2026 MeetMind. All Rights Reserved.

</div>

</footer>

);

}