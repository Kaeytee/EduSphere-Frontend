import React, { useEffect, useState } from "react";
import { AuthService } from "../services/auth";
import useAuth from "../contexts/useAuth";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(() => ({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    username: user?.username || "",
    avatar: user?.avatar || "",
    status: user?.status || "active",
  }));
  const [usernameLastChanged, setUsernameLastChanged] = useState<string | null>(
    user?.usernameLastChanged || null
  );
  const [emailVerified, setEmailVerified] = useState(!!user?.emailVerified);
  const [lastLogin, setLastLogin] = useState<string | null>(
    user?.lastLogin || null
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setForm({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        username: user?.username || "",
        avatar: user?.avatar || "",
        status: user?.status || "active",
      });
      setUsernameLastChanged(user?.usernameLastChanged || null);
      setEmailVerified(!!user?.emailVerified);
      setLastLogin(user?.lastLogin || null);
      setLoading(false);
    }, 500); // Simulate loading for 500ms for UX
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (!user) throw new Error("User not found");
      await AuthService.updateProfile(String(user.id), form);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p className="text-gray-600 mb-8">
        Manage your account and application preferences here.
      </p>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Account Settings</h2>
        {(loading || saving) ? (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-gray-500 text-lg">{loading ? "Loading..." : "Saving..."}</span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            {success && (
              <div className="text-green-600 text-sm mb-2">{success}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
                disabled={
                  usernameLastChanged
                    ? (new Date().getTime() -
                        new Date(usernameLastChanged).getTime()) /
                        (1000 * 60 * 60 * 24 * 30) <
                      5
                    : false
                }
              />
              {usernameLastChanged && (
                <p className="text-xs text-gray-500 mt-1">
                  Username can be changed every 5 months. Last changed:{" "}
                  {new Date(usernameLastChanged).toLocaleDateString()}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                name="avatar"
                value={form.avatar}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="https://your-avatar-url.com/avatar.png"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Verified
              </label>
              <input
                type="checkbox"
                checked={emailVerified}
                readOnly
                className="mr-2"
              />
              <span className="text-xs text-gray-500">(Read only)</span>
            </div>
            {lastLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Login
                </label>
                <div className="text-sm text-gray-600">
                  {new Date(lastLogin).toLocaleString()}
                </div>
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;