import { useEffect, useRef, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import toast from "react-hot-toast";

import {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
} from "../api/user";

import { FiUser, FiCamera, FiUpload } from "react-icons/fi";

import "./Profile.css";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [avatar, setAvatar] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const fileInputRef = useRef(null);

  // Load Profile

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();

        setName(res.data.name || "");
        setEmail(res.data.email || "");
        setAvatar(res.data.avatar || "");
      } catch (error) {
        console.log(error);

        toast.error("Failed to load profile");
      }
    };

    loadProfile();
  }, []);

  // Open File Picker

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Upload Avatar

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    // Optional size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    try {
      setUploadingAvatar(true);

      // Show selected image immediately
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);

      const formData = new FormData();

      formData.append("avatar", file);

      const res = await uploadAvatar(formData);

      // Backend returns:
      // { message, avatar }

      setAvatar(res.data.avatar);

      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Avatar upload error:", error);

      toast.error(
        error.response?.data?.message || "Failed to upload profile picture.",
      );

      // Reload profile if upload fails
      try {
        const res = await getProfile();

        setAvatar(res.data.avatar || "");
      } catch {
        setAvatar("");
      }
    } finally {
      setUploadingAvatar(false);

      // Allows selecting the same image again
      event.target.value = "";
    }
  };

  // Save Profile

  const saveProfile = async () => {
    try {
      await updateProfile({
        name,
        email,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);

      toast.error("Failed to update profile.");
    }
  };

  // Change Password

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

    window.location = "/";
  };

  // Avatar URL

  const avatarUrl = avatar
    ? avatar.startsWith("blob:")
      ? avatar
      : `http://localhost:5000${avatar}`
    : "";

  return (
    <MainLayout>
      <div className="profile-page">
        {/* Page Header */}

        <div className="profile-heading">
          <div>
            <span className="profile-eyebrow">ACCOUNT SETTINGS</span>

            <h1>My Profile</h1>

            <p>Manage your personal information and account settings.</p>
          </div>
        </div>

        {/* =========================
            PROFILE PICTURE
        ========================= */}

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

          {/* Hidden file picker */}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleAvatarChange}
            hidden
          />
        </div>

        {/* =========================
            PERSONAL INFORMATION
        ========================= */}

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

        {/* =========================
            PASSWORD
        ========================= */}

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

        {/* =========================
            LOGOUT
        ========================= */}

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
