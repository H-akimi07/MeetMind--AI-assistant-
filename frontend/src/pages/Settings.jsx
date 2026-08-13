import MainLayout from "../layouts/MainLayout.jsx";
import "./Settings.css";
import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

function Settings() {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const loadUser = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const saveProfile = async () => {
    try {
      await API.put("/users/profile", {
        name: user.name,
        email: user.email,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update profile.");
    }
  };

  return (
    <MainLayout>
      <div className="settings-page">
        {/* PAGE HEADER */}
        <div className="settings-page-header">
          <div>
            <span className="settings-eyebrow">ACCOUNT SETTINGS</span>

            <h1>Settings</h1>

            <p>Manage your profile, security, and account preferences.</p>
          </div>
        </div>

        {/* PROFILE */}
        <section className="settings-card profile-card">
          <div className="settings-card-header">
            <div>
              <span className="settings-section-label">PROFILE</span>

              <h2>Profile Information</h2>

              <p>
                Update the information associated with your MeetMind account.
              </p>
            </div>
          </div>

          <div className="settings-form">
            <div className="settings-field">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                type="text"
                value={user.name}
                onChange={(e) =>
                  setUser({
                    ...user,
                    name: e.target.value,
                  })
                }
                placeholder="Enter your name"
              />
            </div>

            <div className="settings-field">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                type="email"
                value={user.email}
                onChange={(e) =>
                  setUser({
                    ...user,
                    email: e.target.value,
                  })
                }
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="settings-card-footer">
            <span>Keep your account information up to date.</span>

            <button className="settings-btn primary-btn" onClick={saveProfile}>
              Save Changes
            </button>
          </div>
        </section>

        {/* SECURITY */}
        <section className="settings-card">
          <div className="settings-card-header security-header">
            <div>
              <span className="settings-section-label">SECURITY</span>

              <h2>Password</h2>

              <p>
                Keep your account secure by regularly updating your password.
              </p>
            </div>

            <div className="settings-icon">🔒</div>
          </div>

          <div className="settings-card-footer">
            <span>Your password is protected and encrypted.</span>

            <button className="settings-btn secondary-btn">
              Change Password
            </button>
          </div>
        </section>

        {/* DANGER ZONE */}
        <section className="settings-card danger-card">
          <div className="settings-card-header">
            <div>
              <span className="settings-section-label danger-label">
                DANGER ZONE
              </span>

              <h2>Account Actions</h2>

              <p>Actions in this section may affect your account access.</p>
            </div>

            <div className="settings-icon danger-icon">!</div>
          </div>

          <div className="settings-card-footer">
            <span>Sign out from your MeetMind account.</span>

            <button className="settings-btn logout-btn">Logout</button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default Settings;
