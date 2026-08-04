import { useState } from "react";
import "./Contact.css";
import toast from "react-hot-toast";
import API from "../api/axios";
import Navbar from "../components/Navbar.jsx";

function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.message
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {

      await API.post("/contact", formData);

      toast.success("Message sent successfully ✨");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

    } catch {

      toast.error("Could not send message.");

    }
  };

return (

<>

<Navbar />

<div className="contact-page">

      <section className="contact-hero">

        <span>✨ Contact MeetMind</span>

        <h1>
          Let's build smarter
          <br />
          conversations.
        </h1>

        <p>
          Have questions, feedback or ideas?
          We'd love to hear from you.
        </p>

      </section>

      <div className="contact-container">

        <div className="contact-info">

          <div className="info-card">

            <div className="info-icon">📧</div>

            <h3>Email</h3>

            <p>samirahakimi2024@gmail.com</p>

          </div>

          <div className="info-card">

            <div className="info-icon">🌍</div>

            <h3>Location</h3>

            <p>Remote • Worldwide</p>

          </div>

          <div className="info-card">

            <div className="info-icon">🤖</div>

            <h3>AI Support</h3>

            <p>Available 24/7</p>

          </div>

        </div>

        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >

          <h2>Send us a message</h2>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />

          <textarea
            rows="7"
            name="message"
            placeholder="Tell us about your project..."
            value={formData.message}
            onChange={handleChange}
          />

          <button type="submit">
            🚀 Send Message
          </button>

        </form>

      </div>

    </div>

</>

);
}

export default Contact;