import OutlinedCard from "../components/Cardhead";

function Homepage() {
  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-lg p-10">
          
          <header className="flex flex-col text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Goal Management System
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome to your personal achievement tracker
            </p>
          </header>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <OutlinedCard title="Create study goals" link="/login" />
            <OutlinedCard title="Analysis your progress" link="/progress" />
          </div>
        </div>
      </section>
    </>
  );
}

export default Homepage;
