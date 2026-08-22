require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const meetingBotRoutes = require("./routes/meetingBot");
const nylasWebhookRoutes = require("./routes/nylasWebhook");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

/*
DATABASE
*/

connectDB();

/*
MIDDLEWARE
*/

app.use(
  cors({
    origin: [
      "https://meet-mind-ai-assistant.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);

/*
STATIC FILES
*/

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/*
API ROUTES
*/

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/meetings", meetingRoutes);

app.use("/api/meeting-bot", meetingBotRoutes);

app.use("/api/webhooks/nylas", nylasWebhookRoutes);

app.use("/api/contact", contactRoutes);

/*
HEALTH / TEST ROUTES
*/

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
SERVER
*/

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 MeetMind Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
