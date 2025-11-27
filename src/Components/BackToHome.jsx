import { useNavigate } from "react-router-dom";

const BackToHome = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-md font-semibold transition mb-6"
    >
      ← Volver al inicio
    </button>
  );
};

export default BackToHome;
