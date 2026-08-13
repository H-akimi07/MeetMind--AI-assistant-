const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

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

    console.log("📤 Sending contact email...");

    const { data, error } = await resend.emails.send({
      from: "MeetMind <onboarding@resend.dev>",
      to: [process.env.EMAIL_USER],

      replyTo: email,

      subject: `MeetMind Contact: ${subject || "New Message"}`,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Contact Message</h2>

          <p>
            <strong>Name:</strong> ${name}
          </p>

          <p>
            <strong>Email:</strong> ${email}
          </p>

          <p>
            <strong>Subject:</strong> ${subject || "No subject"}
          </p>

          <hr />

          <p>
            <strong>Message:</strong>
          </p>

          <p>
            ${message}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ RESEND ERROR:", error);

      return res.status(500).json({
        message: "Failed to send email",
        error: error.message,
      });
    }

    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("Resend ID:", data?.id);

    return res.status(200).json({
      message: "Email sent successfully",
      id: data?.id,
    });
  } catch (error) {
    console.error("❌ CONTACT ERROR:", error);

    return res.status(500).json({
      message: "Failed to send email",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
};
