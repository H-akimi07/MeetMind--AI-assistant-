import MainLayout from "../layouts/MainLayout.jsx";

import { useEffect, useState } from "react";

import API from "../api/axios";
import toast from "react-hot-toast";

import {
  FiUser,
  FiMail,
  FiLock,
  FiLogOut,
  FiSave,
  FiShield,
  FiAlertTriangle,
} from "react-icons/fi";

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

  const logout = () => {
    localStorage.removeItem("token");
    window.location = "/";
  };

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-[1050px]">
        {/* Header */}
        <div className="mb-8">
          <span className="mb-2 block text-[10px] font-extrabold tracking-[0.2em] text-[#D4AF37]">
            ACCOUNT SETTINGS
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Settings
          </h1>

          <p className="mt-2 text-sm text-[#666]">
            Manage your profile, security, and account preferences.
          </p>
        </div>

        {/* Profile */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#151515]/90 shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition hover:border-white/[0.12]">
          <div className="flex items-start gap-4 border-b border-white/[0.06] p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiUser />
            </div>

            <div>
              <span className="mb-1 block text-[9px] font-extrabold tracking-[0.18em] text-[#555]">
                PROFILE
              </span>

              <h2 className="text-lg font-semibold text-white">
                Profile Information
              </h2>

              <p className="mt-1 text-xs text-[#666]">
                Update the information associated with your MeetMind account.
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="settings-name"
                className="mb-2 block text-xs font-medium text-[#aaa]"
              >
                Full Name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/20 px-4 transition focus-within:border-[#D4AF37]/60 focus-within:bg-black/30">
                <FiUser className="text-[#D4AF37]" />

                <input
                  id="settings-name"
                  type="text"
                  value={user.name}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter your name"
                  className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#444]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="settings-email"
                className="mb-2 block text-xs font-medium text-[#aaa]"
              >
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/20 px-4 transition focus-within:border-[#D4AF37]/60 focus-within:bg-black/30">
                <FiMail className="text-[#D4AF37]" />

                <input
                  id="settings-email"
                  type="email"
                  value={user.email}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      email: e.target.value,
                    })
                  }
                  placeholder="Enter your email"
                  className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#444]"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-[#555]">
              Keep your account information up to date.
            </span>

            <button
              onClick={saveProfile}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#F3CF2E] px-5 py-3 text-xs font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
            >
              <FiSave />
              Save Changes
            </button>
          </div>
        </section>

        {/* Security */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#151515]/90 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          <div className="flex items-start justify-between gap-5 border-b border-white/[0.06] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]">
                <FiShield />
              </div>

              <div>
                <span className="mb-1 block text-[9px] font-extrabold tracking-[0.18em] text-[#555]">
                  SECURITY
                </span>

                <h2 className="text-lg font-semibold text-white">Password</h2>

                <p className="mt-1 text-xs text-[#666]">
                  Keep your account secure by regularly updating your password.
                </p>
              </div>
            </div>

            <div className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-[#D4AF37] sm:flex">
              <FiLock />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t-0 p-6 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-[#555]">
              Your password is protected and encrypted.
            </span>

            <button className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-bold text-white transition hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 hover:text-[#D4AF37]">
              Change Password
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="overflow-hidden rounded-2xl border border-red-500/15 bg-[#151515]/90">
          <div className="flex items-start justify-between gap-5 border-b border-red-500/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/10 text-red-400">
                <FiAlertTriangle />
              </div>

              <div>
                <span className="mb-1 block text-[9px] font-extrabold tracking-[0.18em] text-red-400">
                  DANGER ZONE
                </span>

                <h2 className="text-lg font-semibold text-white">
                  Account Actions
                </h2>

                <p className="mt-1 text-xs text-[#666]">
                  Actions in this section may affect your account access.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-[#555]">
              <FiLogOut />
              Sign out from your MeetMind account.
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-xs font-bold text-red-400 transition hover:bg-red-500/15 hover:text-red-300"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default Settings;
