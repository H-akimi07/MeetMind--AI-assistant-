require("dotenv").config();

const meetingRoutes = require("./routes/meetingRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const connectDB = require("./config/db.js");
const express = require("express");
const cors = require("cors");
const contactRoutes = require("./routes/contactRoutes");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("MeetMind Backend is running!");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Hello from MeetMind Backend!",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Contact
app.use("/api/contact", contactRoutes);
