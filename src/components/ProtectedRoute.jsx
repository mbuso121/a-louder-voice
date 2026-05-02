import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F0E6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-[#4A4A4A]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role === "admin" && user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
