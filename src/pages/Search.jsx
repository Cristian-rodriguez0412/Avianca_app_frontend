import React, { useState } from "react";
import BackToHome from "../Components/BackToHome";

const Search = () => {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fecha, setFecha] = useState("");
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState("");

  const buscarVuelos = async () => {
    setError("");
    setResultados([]);

    try {
      const response = await fetch(
        "https://avianca-app-backend-4.onrender.com/api/flights/search",   // 🔥 URL CORRECTA
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ origen, destino, fecha }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al buscar vuelos.");
        return;
      }

      setResultados(data.results || []);
    } catch (err) {
      console.error("❌ Error de conexión:", err);
      setError("❌ Error al conectar con el servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 p-8">
      <BackToHome />

      <h1 className="text-3xl font-bold text-center text-white drop-shadow mb-6">
        ✈️ Buscar Vuelos
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
        <label>Ciudad de origen</label>
        <input
          type="text"
          className="w-full p-2 mb-3 rounded border"
          value={origen}
          onChange={(e) => setOrigen(e.target.value)}
        />

        <label>Ciudad destino</label>
        <input
          type="text"
          className="w-full p-2 mb-3 rounded border"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        />

        <label>Fecha del vuelo</label>
        <input
          type="date"
          className="w-full p-2 mb-4 rounded border"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <button
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
          onClick={buscarVuelos}
        >
          Buscar vuelos
        </button>

        {error && (
          <p className="mt-4 text-red-700 bg-red-200 p-2 rounded">{error}</p>
        )}
      </div>

      {resultados.length > 0 && (
        <div className="max-w-lg mx-auto mt-6 space-y-4">
          {resultados.map((v, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-bold text-red-500">
                Vuelo {v.flight_number}
              </h3>
              <p><b>Salida:</b> {v.departure}</p>
              <p><b>Llegada:</b> {v.arrival}</p>
              <p><b>Precio:</b> USD {v.price_usd}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
