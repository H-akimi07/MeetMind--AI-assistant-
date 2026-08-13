import { useState } from "react";
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

    if (!formData.name || !formData.email || !formData.message) {
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

      <div
        className="
          relative min-h-screen overflow-hidden
          bg-[#050505] px-[8%] py-[120px]
          text-white
          max-md:px-[5%] max-md:py-[100px]
        "
      >
        {/* GOLD GLOW */}

        <div
          className="
            pointer-events-none absolute
            -right-[200px] -top-[200px]
            h-[650px] w-[650px]
            rounded-full
            bg-[radial-gradient(circle,rgba(212,175,55,0.18),transparent_70%)]
            blur-[60px]
          "
        />

        {/* HERO */}

        <section className="relative mx-auto mb-[90px] max-w-[850px] text-center">
          <span
            className="
              inline-block rounded-full
              border border-[#d4af37]
              bg-[#111]
              px-7 py-3
              text-[#d4af37]
            "
          >
            ✨ Contact MeetMind
          </span>

          <h1
            className="
              my-[35px]
              text-[72px] font-extrabold leading-[1.1]
              max-lg:text-[56px]
              max-md:text-[42px]
            "
          >
            Let's build smarter
            <br />
            conversations.
          </h1>

          <p className="mx-auto max-w-[700px] text-[20px] text-[#999] max-md:text-[16px]">
            Have questions, feedback or ideas? We'd love to hear from you.
          </p>
        </section>

        {/* CONTENT */}

        <div className="relative grid grid-cols-[320px_1fr] items-start gap-[45px] max-lg:grid-cols-1">
          {/* INFO */}

          <div className="flex flex-col gap-[25px]">
            {/* EMAIL */}

            <div
              className="
                rounded-[25px]
                border border-[rgba(212,175,55,0.18)]
                bg-[rgba(20,20,20,0.75)]
                p-[30px]
                backdrop-blur-[16px]
                transition-all duration-300
                hover:-translate-y-1.5
                hover:border-[#d4af37]
                hover:shadow-[0_15px_35px_rgba(212,175,55,0.25)]
              "
            >
              <div className="mb-[18px] text-[34px]">📧</div>

              <h3 className="mb-2 text-[#d4af37]">Email</h3>

              <p className="leading-[1.6] text-[#999]">
                samirahakimi2024@gmail.com
              </p>
            </div>

            {/* LOCATION */}

            <div
              className="
                rounded-[25px]
                border border-[rgba(212,175,55,0.18)]
                bg-[rgba(20,20,20,0.75)]
                p-[30px]
                backdrop-blur-[16px]
                transition-all duration-300
                hover:-translate-y-1.5
                hover:border-[#d4af37]
                hover:shadow-[0_15px_35px_rgba(212,175,55,0.25)]
              "
            >
              <div className="mb-[18px] text-[34px]">🌍</div>

              <h3 className="mb-2 text-[#d4af37]">Location</h3>

              <p className="leading-[1.6] text-[#999]">Remote • Worldwide</p>
            </div>

            {/* AI SUPPORT */}

            <div
              className="
                rounded-[25px]
                border border-[rgba(212,175,55,0.18)]
                bg-[rgba(20,20,20,0.75)]
                p-[30px]
                backdrop-blur-[16px]
                transition-all duration-300
                hover:-translate-y-1.5
                hover:border-[#d4af37]
                hover:shadow-[0_15px_35px_rgba(212,175,55,0.25)]
              "
            >
              <div className="mb-[18px] text-[34px]">🤖</div>

              <h3 className="mb-2 text-[#d4af37]">AI Support</h3>

              <p className="leading-[1.6] text-[#999]">Available 24/7</p>
            </div>
          </div>

          {/* FORM */}

          <form
            className="
              rounded-[35px]
              border border-[rgba(212,175,55,0.18)]
              bg-[rgba(12,12,12,0.9)]
              p-[45px]
              shadow-[0_25px_60px_rgba(0,0,0,0.4)]
              backdrop-blur-[18px]
              max-md:p-[25px]
            "
            onSubmit={handleSubmit}
          >
            <h2 className="mb-[30px] text-[30px] font-semibold text-[#d4af37]">
              Send us a message
            </h2>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="
                mb-[22px] w-full rounded-[16px]
                border border-[#222]
                bg-[#090909]
                p-[18px]
                text-[16px] text-white
                outline-none
                placeholder:text-[#666]
                transition
                focus:border-[#d4af37]
                focus:shadow-[0_0_18px_rgba(212,175,55,0.25)]
              "
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="
                mb-[22px] w-full rounded-[16px]
                border border-[#222]
                bg-[#090909]
                p-[18px]
                text-[16px] text-white
                outline-none
                placeholder:text-[#666]
                transition
                focus:border-[#d4af37]
                focus:shadow-[0_0_18px_rgba(212,175,55,0.25)]
              "
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="
                mb-[22px] w-full rounded-[16px]
                border border-[#222]
                bg-[#090909]
                p-[18px]
                text-[16px] text-white
                outline-none
                placeholder:text-[#666]
                transition
                focus:border-[#d4af37]
                focus:shadow-[0_0_18px_rgba(212,175,55,0.25)]
              "
            />

            <textarea
              rows="7"
              name="message"
              placeholder="Tell us about your project..."
              value={formData.message}
              onChange={handleChange}
              className="
                mb-[22px] w-full resize-y rounded-[16px]
                border border-[#222]
                bg-[#090909]
                p-[18px]
                text-[16px] text-white
                outline-none
                placeholder:text-[#666]
                transition
                focus:border-[#d4af37]
                focus:shadow-[0_0_18px_rgba(212,175,55,0.25)]
              "
            />

            <button
              type="submit"
              className="
                w-[30%] rounded-[30px]
                bg-gradient-to-r from-[#d4af37] to-[#f5d76e]
                px-5 py-2.5
                text-[12px] font-bold text-[#111]
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-[0_20px_40px_rgba(212,175,55,0.4)]
                max-md:w-full
              "
            >
              🚀 Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contact;
