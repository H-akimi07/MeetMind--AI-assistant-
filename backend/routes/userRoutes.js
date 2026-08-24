const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
// const upload = require("../middleware/upload");
const avatarUpload = require("../middleware/avatarUpload");

// Get Profile
router.get("/profile", authMiddleware, getProfile);

// Update Profile
router.put("/profile", authMiddleware, updateProfile);

// Change Password
router.put("/change-password", authMiddleware, changePassword);

// Upload Profile Avatar

// router.put(
//   "/profile/avatar",
//   authMiddleware,
//   upload.single("avatar"),
//   uploadAvatar,
// );
router.put(
  "/profile/avatar",
  authMiddleware,
  avatarUpload.single("avatar"),
  uploadAvatar,
);
module.exports = router;
