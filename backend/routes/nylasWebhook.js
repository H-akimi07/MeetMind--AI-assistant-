const express = require("express");

const router = express.Router();

// Nylas webhook verification
router.get("/", (req, res) => {
  const challenge = req.query.challenge;

  console.log("🔐 Nylas webhook challenge received:", challenge);

  if (!challenge) {
    return res.status(400).send("Missing challenge");
  }

  res.status(200).send(challenge);
});

// Nylas webhook events
router.post("/", async (req, res) => {
  console.log("📩 Nylas webhook received:");
  console.log(JSON.stringify(req.body, null, 2));

  // Respond immediately
  res.sendStatus(200);
});

module.exports = router;
