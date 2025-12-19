import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanel from "../components/AdminPanel.jsx";
import ManagerPanel from "../components/ManagerPanel.jsx";
import UserPanel from "../components/UserPanel.jsx";



export default function Dashboard() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) {
      navigate("/");
    } else {
      setRole(storedRole);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">     
        <h1 className="text-3xl font-bold mb-6">TaskForge</h1>

      {role === "admin" && (
        <AdminPanel />
      )}

      {role === "manager" && (
        <ManagerPanel />
      )}

      {role === "user" && (
        <UserPanel />
      )}
    </div>
  );
}
