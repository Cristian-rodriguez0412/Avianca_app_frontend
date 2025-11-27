import React, { useState } from "react";
import BackToHome from "../Components/BackToHome";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = "https://avianca-app-backend-4.onrender.com";

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("⚠️ Por favor ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data || !data.token) {
        throw new Error("Respuesta inesperada del servidor");
      }

      // Guardar sesión
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));

      setSuccess("Inicio de sesión exitoso 🎉");

      // Redirigir después de 1 segundo
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1000);

    } catch (err) {
      console.log(err);
      setError("❌ No se pudo iniciar sesión. Intenta nuevamente.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-500 flex flex-col items-center justify-center p-8">

      <BackToHome />

      <h1 className="text-4xl font-bold text-white mb-4">
        🔐 Iniciar Sesión
      </h1>

      <p className="text-white text-lg mb-6 text-center">
        Accede para gestionar vuelos y tu perfil
      </p>

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">

        {/* Email */}
        <label className="block font-semibold mb-1">Correo electrónico</label>
        <input
          type="email"
          placeholder="usuario@correo.com"
          className="border p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-red-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <label className="block font-semibold mb-1">Contraseña</label>
        <input
          type="password"
          placeholder="••••••••"
          className="border p-3 rounded-lg w-full mb-6 focus:ring-2 focus:ring-red-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Botón */}
        <button
          onClick={handleLogin}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-lg transition"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>

        {/* Mensajes */}
        {error && (
          <p className="text-red-600 text-center mt-4 font-semibold animate-pulse">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 text-center mt-4 font-semibold animate-bounce">
            {success}
          </p>
        )}

      </div>
    </div>
  );
};

export default Login;
