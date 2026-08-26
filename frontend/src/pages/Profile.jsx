import { useRef, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import toast from "react-hot-toast";

import { updateProfile, changePassword, uploadAvatar } from "../api/user";

import { useUser } from "../context/UserContext";

import { FiUser, FiCamera, FiUpload } from "react-icons/fi";

import "./Profile.css";

function Profile() {
  const { user, loadingUser, updateAvatar, updateUser } = useUser();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const fileInputRef = useRef(null);

  if (loadingUser) {
    return (
      <MainLayout>
        <div className="profile-page">
          <p>Loading profile...</p>
        </div>
      </MainLayout>
    );
  }

  // Open file picker
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Upload avatar
  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Check image type
    if (!file.type || !file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      event.target.value = "";
      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploadingAvatar(true);

      // Same upload method as the working Sidebar
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await uploadAvatar(formData);

      // Update UserContext
      updateAvatar(res.data.avatar);

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Avatar upload error:", error);

      toast.error(
        error.response?.data?.message || "Failed to upload profile picture.",
      );
    } finally {
      setUploadingAvatar(false);

      // Reset input so the same image can be selected again
      event.target.value = "";
    }
  };

  // Save profile
  const saveProfile = async () => {
    try {
      const res = await updateProfile({
        name,
        email,
      });

      updateUser({
        name: res.data.name,
        email: res.data.email,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  // Change password
  const savePassword = async () => {
    try {
      await changePassword({
        oldPassword,
        newPassword,
      });

      toast.success("Password updated successfully!");

      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to change password.",
      );
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    window.location = "/";
  };

  // Avatar URL
  const avatarUrl = user?.avatar
    ? `https://meetmind-ai-assistant.onrender.com${user.avatar}`
    : null;

  return (
    <MainLayout>
      <div className="profile-page">
        {/* PAGE HEADER */}

        <div className="profile-heading">
          <div>
            <span className="profile-eyebrow">ACCOUNT SETTINGS</span>

            <h1>My Profile</h1>

            <p>Manage your personal information and account settings.</p>
          </div>
        </div>

        {/* PROFILE PICTURE */}

        <div className="profile-card avatar-card">
          <div className="profile-section-header">
            <div className="section-icon">
              <FiUser />
            </div>

            <div>
              <h2>Profile Picture</h2>

              <p>Add a photo to personalize your MeetMind profile.</p>
            </div>
          </div>

          <div className="avatar-upload-area">
            <button
              type="button"
              className="profile-avatar-button"
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              aria-label="Upload profile picture"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="profile-avatar" />
              ) : (
                <div className="profile-avatar-placeholder">
                  <FiUser />
                </div>
              )}

              <span className="avatar-camera">
                <FiCamera />
              </span>
            </button>

            <div className="avatar-info">
              <strong>
                {uploadingAvatar ? "Uploading..." : "Your profile picture"}
              </strong>

              <span>Click the person icon to choose an image</span>

              <small>JPG, PNG or WEBP • Maximum 5MB</small>
            </div>

            <button
              type="button"
              className="upload-picture-btn"
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
            >
              <FiUpload />

              {uploadingAvatar ? "Uploading..." : "Choose Photo"}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            hidden
          />
        </div>

        {/* PERSONAL INFORMATION */}

        <div className="profile-card">
          <div className="profile-section-header">
            <div className="section-icon">
              <FiUser />
            </div>

            <div>
              <h2>Personal Information</h2>

              <p>Update your name and email address.</p>
            </div>
          </div>

          <div className="profile-form">
            <div className="profile-field">
              <label htmlFor="name">Full Name</label>

              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="profile-field">
              <label htmlFor="email">Email Address</label>

              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={saveProfile}
              className="profile-save-btn"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* PASSWORD */}

        <div className="profile-card">
          <div className="profile-section-header">
            <div className="section-icon">🔐</div>

            <div>
              <h2>Change Password</h2>

              <p>Keep your account secure with a strong password.</p>
            </div>
          </div>

          <div className="profile-form">
            <div className="profile-field">
              <label htmlFor="oldPassword">Current Password</label>

              <input
                type="password"
                id="oldPassword"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="profile-field">
              <label htmlFor="newPassword">New Password</label>

              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={savePassword}
              className="profile-save-btn"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* LOGOUT */}

        <div className="profile-card logout-card">
          <div>
            <h2>Sign Out</h2>

            <p>Sign out of your MeetMind account on this device.</p>
          </div>

          <button type="button" className="logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;
