import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home          from "./pages/Home";
import Analysis      from "./pages/Analysis";
import Engagement    from "./pages/Engagement";
import Letters       from "./pages/Letters";
import SMME          from "./pages/SMME";
import About         from "./pages/About";
import Contact       from "./pages/Contact";
import Submit        from "./pages/Submit";
import Admin         from "./pages/Admin";
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";
import PostDetail    from "./pages/PostDetail";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login"            element={<Login />} />
      <Route path="/register"         element={<Register />} />
      <Route path="/forgot-password"  element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* PUBLIC */}
      <Route path="/"           element={<MainLayout><Home /></MainLayout>} />
      <Route path="/analysis"   element={<MainLayout><Analysis /></MainLayout>} />
      <Route path="/engagement" element={<MainLayout><Engagement /></MainLayout>} />
      <Route path="/letters"    element={<MainLayout><Letters /></MainLayout>} />
      <Route path="/smme"       element={<MainLayout><SMME /></MainLayout>} />
      <Route path="/about"      element={<MainLayout><About /></MainLayout>} />
      <Route path="/contact"    element={<MainLayout><Contact /></MainLayout>} />
      <Route path="/post/:id"   element={<MainLayout><PostDetail /></MainLayout>} />

      {/* PROTECTED: logged-in users */}
      <Route path="/submit" element={
        <ProtectedRoute>
          <MainLayout><Submit /></MainLayout>
        </ProtectedRoute>
      } />

      {/* PROTECTED: admin only */}
      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <Admin />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
