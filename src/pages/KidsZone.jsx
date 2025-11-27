import React from "react";
import BackToHome from "../Components/BackToHome";
import KidsCard from "../Components/KidsCard";

const KidsZone = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-200 to-red-400 p-6">
      <BackToHome />

      <h1 className="text-4xl font-bold text-center text-white drop-shadow mb-8">
        ✈️ Avianca Kids
      </h1>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center max-w-3xl mx-auto">

        {/* Juego de Aviones */}
        <KidsCard
          icon="✈️"
          title="Juego de Aviones"
          onClick={() => (window.location.href = "/kids/airplane-game")}
        />

        {/* Juego de Cohetes */}
        <KidsCard
          icon="🚀"
          title="Juego de Cohetes"
          onClick={() => (window.location.href = "/kids/rocket-game")}
        />

        {/* Rompecabezas */}
        <KidsCard
          icon="🧩"
          title="Rompecabezas"
          onClick={() => (window.location.href = "/kids/puzzle")}
        />

        {/* Colorear */}
        <KidsCard
          icon="🎨"
          title="Colorear"
          onClick={() => alert("Zona de colorear muy pronto 🎨")}
        />

      </div>
    </div>
  );
};

export default KidsZone;
