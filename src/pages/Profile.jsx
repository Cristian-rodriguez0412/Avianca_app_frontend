import React, { useEffect, useState } from "react";
import BackToHome from "../Components/BackToHome";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [miles, setMiles] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = "https://avianca-app-backend-4.onrender.com";

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userData = localStorage.getItem("userData");

    if (!token || !userData) {
      // No autorizado: redirige al login
      window.location.href = "/login";
      return;
    }

    setUser(JSON.parse(userData));

    const fetchMiles = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/miles`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Error al obtener millas");
        }

        const data = await res.json();
        setMiles(data.miles || null);
      } catch (error) {
        console.error("Error cargando millas", error);
        setMiles(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMiles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 p-8">
      <BackToHome />
      
      <h1 className="text-3xl font-bold text-center text-white drop-shadow-lg mb-6">
        👤 Mi Perfil
      </h1>

      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        {user ? (
          <>
            <p className="text-xl font-semibold mb-3">Nombre: {user.name}</p>
            <p className="text-lg mb-3">Correo: {user.email}</p>

            <p className="text-lg font-semibold mt-6 mb-1">Estado:</p>
            <p className="text-blue-700 font-bold text-xl">
              {user.tier || "Silver"}
            </p>

            <hr className="my-6" />

            <p className="text-xl font-semibold mb-2">✈️ Millas</p>

            {miles ? (
              <div>
                <p>
                  Disponibles: <b>{miles.available}</b>
                </p>
                <p>
                  Pendientes: <b>{miles.pending}</b>
                </p>
                {miles.last_update && (
                  <p className="text-sm mt-2 text-gray-500">
                    Actualizado: {miles.last_update}
                  </p>
                )}
              </div>
            ) : (
              <p>No se pudieron cargar las millas.</p>
            )}

            <button
              className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <p>No hay información del usuario.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
