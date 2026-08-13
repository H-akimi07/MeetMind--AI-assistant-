import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import toast from "react-hot-toast";

import { getProfile, updateProfile, changePassword } from "../api/user";

import "./Profile.css";

function Profile() {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  // Load Profile

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();

        setName(res.data.name || "");
        setEmail(res.data.email || "");
      } catch (error) {
        console.log(error);

        toast.error("Failed to load profile");
      }
    };

    loadProfile();
  }, []);
  // Save Profile

  const saveProfile = async () => {
    try {
      await updateProfile({
        name,

        email,
      });

      toast.success("Profile updated successfully!");
    } catch {
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
    } catch {
      toast.error("Failed to change password.");
    }
  };

  // Logout

  const logout = () => {
    localStorage.removeItem("token");

    window.location = "/";
  };

  return (
    <MainLayout>
      <div className="profile-page">
        <h1>My Profile</h1>

        <div className="profile-card">
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={saveProfile}>Save Changes</button>
        </div>

        <div className="profile-card">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button onClick={savePassword}>Update Password</button>
        </div>

        <div className="profile-card">
          <button className="logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;
