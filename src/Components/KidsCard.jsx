import React from "react";

const KidsCard = ({ icon, title, onClick }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center 
      justify-center hover:scale-105 transition cursor-pointer w-40 h-40"
      onClick={onClick}
    >
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg text-gray-700 text-center">{title}</h3>
    </div>
  );
};

export default KidsCard;
