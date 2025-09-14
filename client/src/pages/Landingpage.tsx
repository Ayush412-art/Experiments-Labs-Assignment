import { useNavigate } from "react-router-dom";

function Landingpage() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r bg-gray-50 dark:bg-gray-900 text-center px-4">

      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
        Goal Management System
      </h1>
      <p className="text-lg md:text-xl text-gray-200 max-w-xl mb-8">
        Set your goals, track your progress, and stay motivated with a
        structured roadmap to success.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all"
      >
        Get Started
      </button>
    </section>
  );
}

export default Landingpage;
