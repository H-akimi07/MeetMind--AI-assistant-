import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import toast from "react-hot-toast";

import { getProfile, updateProfile, changePassword } from "../api/user";

import {
  FiUser,
  FiMail,
  FiLock,
  FiLogOut,
  FiSave,
  FiShield,
} from "react-icons/fi";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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

  const logout = () => {
    localStorage.removeItem("token");
    window.location = "/";
  };

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-[1000px]">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              Account
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-[#777]">
            Manage your personal information and account security.
          </p>
        </div>

        {/* Profile Information */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-[#292929] bg-[#111] shadow-[0_15px_50px_rgba(0,0,0,0.25)]">
          <div className="border-b border-[#242424] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]">
                <FiUser />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Profile Information
                </h2>

                <p className="mt-1 text-xs text-[#666]">
                  Update the information associated with your account.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-[#aaa]">
                Full Name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#292929] bg-[#080808] px-4 transition-all focus-within:border-[#D4AF37]/60">
                <FiUser className="text-[#D4AF37]" />

                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#555]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#aaa]">
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#292929] bg-[#080808] px-4 transition-all focus-within:border-[#D4AF37]/60">
                <FiMail className="text-[#D4AF37]" />

                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#555]"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#242424] p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#555]">
              Keep your account information up to date.
            </p>

            <button
              onClick={saveProfile}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
            >
              <FiSave />
              Save Changes
            </button>
          </div>
        </section>

        {/* Security */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-[#292929] bg-[#111] shadow-[0_15px_50px_rgba(0,0,0,0.25)]">
          <div className="border-b border-[#242424] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]">
                <FiShield />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">Security</h2>

                <p className="mt-1 text-xs text-[#666]">
                  Update your password to keep your account secure.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-[#aaa]">
                Current Password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#292929] bg-[#080808] px-4 transition-all focus-within:border-[#D4AF37]/60">
                <FiLock className="text-[#D4AF37]" />

                <input
                  type="password"
                  placeholder="Current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#555]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#aaa]">
                New Password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#292929] bg-[#080808] px-4 transition-all focus-within:border-[#D4AF37]/60">
                <FiLock className="text-[#D4AF37]" />

                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#555]"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#242424] p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#555]">
              Use a strong password that you don't reuse elsewhere.
            </p>

            <button
              onClick={savePassword}
              className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-3 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/15"
            >
              Update Password
            </button>
          </div>
        </section>

        {/* Logout */}
        <section className="overflow-hidden rounded-2xl border border-red-500/15 bg-[#111]">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/10 text-red-400">
                <FiLogOut />
              </div>

              <div>
                <h2 className="font-semibold text-white">Sign Out</h2>

                <p className="mt-1 text-xs text-[#666]">
                  Sign out from your MeetMind account.
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/15"
            >
              Logout
            </button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default Profile;
