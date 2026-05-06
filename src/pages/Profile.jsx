import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import API from "../lib/api";
import SEO from "../components/SEO";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("submissions");

  const [pwForm, setPwForm] = useState({ current: "", password: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchSubmissions();
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(`${API}/posts/my-submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError(""); setPwSuccess("");
    if (pwForm.password.length < 8) return setPwError("Password must be at least 8 characters");
    if (pwForm.password !== pwForm.confirm) return setPwError("Passwords don't match");
    setPwLoading(true);
    try {
      await axios.put(`${API}/auth/change-password`, {
        currentPassword: pwForm.current,
        newPassword: pwForm.password
      }, { headers: { Authorization: `Bearer ${token}` } });
      setPwSuccess("Password updated successfully!");
      setPwForm({ current: "", password: "", confirm: "" });
    } catch (err) {
      setPwError(err.response?.data?.error || "Failed to update password");
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F4F0E6] py-16 px-6">
      <SEO title="My Profile" description="Manage your A Louder Voice profile and submissions." path="/profile" />
      <div className="max-w-3xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* HEADER */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-[#C5A059] flex items-center justify-center text-white text-2xl font-light mx-auto mb-4">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <h1 className="text-4xl font-light mb-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              {user.name}
            </h1>
            <p className="text-sm text-[#4A4A4A]">{user.email}</p>
            {user.role === "admin" && (
              <span className="inline-block mt-2 text-xs uppercase tracking-widest text-[#C5A059] border border-[#C5A059] px-3 py-1">
                Admin
              </span>
            )}
          </div>

          {/* TABS */}
          <div className="flex border-b border-[#0A0A0A]/10 mb-8">
            {["submissions", "security"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-3 text-xs uppercase tracking-widest transition ${
                  tab === t ? "border-b-2 border-[#C5A059] text-[#0A0A0A]" : "text-[#4A4A4A] hover:text-[#0A0A0A]"
                }`}>
                {t}
              </button>
            ))}
          </div>

          {/* SUBMISSIONS TAB */}
          {tab === "submissions" && (
            <div>
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="bg-[#EAE5D9] h-20 animate-pulse" />
                  ))}
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-[#4A4A4A] mb-4">You haven't submitted anything yet.</p>
                  <button onClick={() => navigate("/submit")}
                    className="bg-[#0A0A0A] text-[#F4F0E6] px-6 py-3 text-sm uppercase tracking-widest hover:bg-[#C5A059] transition">
                    Share Your Voice
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map(post => (
                    <div key={post._id} className="bg-[#EAE5D9] border p-6 flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-widest text-[#C5A059] mb-1">{post.category}</p>
                        <h3 className="font-medium truncate">{post.title || "(Untitled)"}</h3>
                        <p className="text-xs text-[#4A4A4A] mt-1">
                          {new Date(post.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <span className={`ml-4 text-xs uppercase tracking-widest px-3 py-1 flex-shrink-0 ${
                        post.status === "approved" ? "bg-green-100 text-green-800" :
                        post.status === "rejected" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECURITY TAB */}
          {tab === "security" && (
            <div className="max-w-md">
              <h2 className="text-lg mb-6">Change Password</h2>

              {pwError && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-4">{pwError}</div>}
              {pwSuccess && <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm mb-4">{pwSuccess}</div>}

              <form onSubmit={handlePasswordChange} className="space-y-5">
                {[
                  { label: "Current Password", field: "current", type: "password" },
                  { label: "New Password", field: "password", type: "password" },
                  { label: "Confirm New Password", field: "confirm", type: "password" },
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">{label}</label>
                    <input type={type} value={pwForm[field]}
                      onChange={e => setPwForm({ ...pwForm, [field]: e.target.value })}
                      className="w-full border-b border-[#0A0A0A]/20 bg-transparent py-2 text-sm focus:outline-none"
                      required />
                  </div>
                ))}
                <button type="submit" disabled={pwLoading}
                  className="w-full bg-[#0A0A0A] text-[#F4F0E6] py-3 text-sm uppercase tracking-widest hover:bg-[#C5A059] transition disabled:opacity-50">
                  {pwLoading ? "Updating..." : "Update Password"}
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-[#0A0A0A]/10">
                <button onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700 transition uppercase tracking-widest">
                  Sign Out
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
