import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleSubmit = async () => {
    const url = `http://localhost:3001/api/auth/${isLogin ? "login" : "signup"}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (isLogin && data.token) {
        localStorage.setItem("token", data.token);
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        localStorage.setItem("role", payload.role);
        navigate("/Dashboard")
      } else if (!isLogin && data.role) {
        setMessage(`Inscription réussie ! Rôle : ${data.role}`);
      } else {
        setMessage(data.message || JSON.stringify(data));
      }
    } catch (err) {
      setMessage("Erreur serveur");
      console.error(err);
    }
  };

  const getProtected = async () => {
    if (!token) return setMessage("Vous devez vous connecter !");
    try {
      const res = await fetch("http://localhost:3001/api/auth/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(data.message || JSON.stringify(data));
    } catch (err) {
      setMessage("Erreur lors de l'accès à la route protégée");
      console.error(err);
    }
  };

  return (
    <div className="dark min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 space-y-6">
      <h1 className="text-5xl font-extrabold text-blue-400">TaskForge</h1>

      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          {isLogin ? "Connexion" : "Inscription"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors mb-4"
          onClick={handleSubmit}
        >
          {isLogin ? "Se connecter" : "S'inscrire"}
        </button>

        <button
          className="w-full text-blue-400 hover:underline mb-4"
          onClick={toggleForm}
        >
          {isLogin ? "Créer un compte" : "Se connecter"}
        </button>

        {/* {token && (
          <button
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors mb-4"
            onClick={getProtected}
          >
            Tester route protégée
          </button>
        )}*/}

        {message && <p className="text-center text-red-500 mt-2">{message}</p>}
      </div>
    </div>
  );
}
