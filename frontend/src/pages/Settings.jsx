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

      await API.put(
        "/users/profile",
        {
          name: user.name,
          email: user.email,
        }
      );

      toast.success("Profile updated successfully!");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Could not update profile."
      );

    }

  };

  return (

    <MainLayout>
      <div className="settings-page">

        <h1>Settings</h1>

        <div className="settings-card">

          <h3>Profile Information</h3>

          <label>Name</label>

          <input
            value={user.name}
            onChange={(e) =>
              setUser({
                ...user,
                name: e.target.value,
              })
            }
          />

          <label>Email</label>

          <input
            value={user.email}
            onChange={(e) =>
              setUser({
                ...user,
                email: e.target.value,
              })
            }
          />

          <button onClick={saveProfile}>
            Save Changes
          </button>

        </div>

        <div className="settings-card">

          <h3>Password</h3>

          <p>Change your password securely.</p>

          <button>
            Change Password
          </button>

        </div>

        <div className="settings-card">

          <h3>Danger Zone</h3>

          <p>Logout from MeetMind safely.</p>

          <button className="logout-btn">
            Logout
          </button>

        </div>

      </div>

</MainLayout>
  );

}

export default Settings;