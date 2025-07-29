// src/components/AdminLoginButton.jsx
import React from "react";
import * as LucideIcons from "lucide-react"; // For the lock icon

const AdminLoginButton = ({ isVisible }) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleAdminLogin = () => {
    window.location.href = `${backendUrl}/auth/google`;
  };

  if (!isVisible) {
    return null; // Don't render if not visible
  }

  return (
    <button
      onClick={handleAdminLogin}
      className="px-4 py-2 text-base bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center"
    >
      <LucideIcons.Unlock className="w-4 h-4 mr-2" />
      Admin Login
    </button>
  );
};

export default AdminLoginButton;
