const nodemailer = require("nodemailer");

const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    console.log("📩 CONTACT REQUEST RECEIVED");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Subject:", subject);

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required.",
      });
    }

    console.log("📧 Creating Gmail transporter...");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    console.log("🔍 Verifying SMTP connection...");

    await transporter.verify();

    console.log("✅ SMTP connection successful");

    console.log("📤 Sending email...");

    await transporter.sendMail({
      from: `"MeetMind Contact" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,

      subject: `MeetMind Contact: ${subject || "New Message"}`,

      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Contact Message</h2>

          <p><strong>Name:</strong> ${name}</p>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Subject:</strong> ${subject || "No subject"}</p>

          <p><strong>Message:</strong></p>

          <p>${message}</p>
        </div>
      `,
    });

    console.log("✅ EMAIL SENT SUCCESSFULLY");

    return res.status(200).json({
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("❌ CONTACT EMAIL ERROR");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Command:", error.command);

    return res.status(500).json({
      message: "Failed to send email",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
};
