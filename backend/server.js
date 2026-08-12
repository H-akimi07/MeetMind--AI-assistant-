require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const nylasWebhookRoutes = require("./routes/nylasWebhook");
const contactRoutes = require("./routes/contactRoutes");
const meetingBotRoutes = require("./routes/meetingBot");

const app = express();

/* =====================================================
   DATABASE
===================================================== */

connectDB();

/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(cors());

/*
  Keep the exact raw request body.

  Nylas uses this raw body to verify
  the X-Nylas-Signature header.
*/
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = Buffer.from(buf);
    },
  }),
);

/* =====================================================
   STATIC FILES
===================================================== */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =====================================================
   API ROUTES
===================================================== */

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/meetings", meetingRoutes);

app.use("/api/meeting-bot", meetingBotRoutes);

/*
  IMPORTANT:
  Nylas webhook must be registered at:

  https://meetmind-ai-assistant.onrender.com/api/webhooks/nylas
*/
app.use("/api/webhooks/nylas", nylasWebhookRoutes);

app.use("/api/contact", contactRoutes);

/* =====================================================
   TEST ROUTES
===================================================== */

app.get("/", (req, res) => {
  res.status(200).send("MeetMind Backend is running!");
});

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello from MeetMind Backend!",
  });
});

/*
  Test Nylas webhook endpoint manually in browser.
*/
app.get("/api/webhooks/nylas/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MeetMind Nylas webhook endpoint is reachable!",
  });
});

/* =====================================================
   ERROR HANDLER
===================================================== */

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

/* =====================================================
   START SERVER
===================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log("🚀 MeetMind Backend Started");
  console.log(`🚀 Port: ${PORT}`);
  console.log("=================================");
});
