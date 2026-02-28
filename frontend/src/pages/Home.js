import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import assess from '../assets/assess.svg'
import explore from '../assets/explore.svg'
import profile from '../assets/profile.svg'
import clg from '../assets/xlg.svg'
import studying from '../assets/studying.svg'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-center text-center md:text-left px-8 mt-20 hero">
        <div className="max-w-lg">
          <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 leading-tight mb-4 transition-colors">
            Find Your Perfect Career Path 🎯
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 transition-colors">
            A personalized digital guidance platform that helps you make informed academic
            and career decisions based on your interests, aptitude, and goals.
          </p>

          <a
            href="/assessment"
            className="px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white text-lg rounded-xl shadow hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300"
          >
            Start Assessment
          </a>
        </div>

        <div className="mt-10 md:mt-0 md:ml-10">
          <img
            src={studying}
            alt="Career Guidance Illustration"
            className="w-80 md:w-96 drop-shadow-lg"
          />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white dark:bg-gray-800 py-16 px-6 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12 transition-colors">
          Why Choose Our Platform?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-2xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
              🎓 Smart Recommendations
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get AI-powered suggestions for courses, colleges, and career paths
              based on your skills and preferences.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-2xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
              🧠 Psychometric Insights
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Take assessments to understand your aptitude, interests, and personality traits.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-2xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
              📍 Local College Finder
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Explore nearby government and private colleges offering the courses best suited for you.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
{/* HOW IT WORKS SECTION */}
<section className="bg-gray-50 dark:bg-gray-900 py-16 px-6 transition-colors duration-300">
  <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12 transition-colors">
    How It Works
  </h2>

  <div className="how-grid max-w-6xl mx-auto">

    {/* 1 - Take Assessment */}
    <div className="how-card bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center">
      <img src={assess} alt="Assessment" className="w-1/2 mb-4" />
      <h3 className="text-2xl font-semibold text-blue-700 mb-3">
        1️⃣ Take Assessment
      </h3>
      <p className="text-lg text-gray-600">
        Complete our guided aptitude & interest assessment.
      </p>
    </div>

    {/* 2 - View Profile */}
    <div className="how-card bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center">
      <img src={profile} alt="Profile" className="w-1/2 mb-4" />
      <h3 className="text-2xl font-semibold text-blue-700 mb-3">
        2️⃣ View Your Profile
      </h3>
      <p className="text-lg text-gray-600">
        Instantly receive a detailed strengths and skills report.
      </p>
    </div>

    {/* 3 - Explore Careers */}
    <div className="how-card bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center">
      <img src={explore} alt="Explore Careers" className="w-1/2 mb-4" />
      <h3 className="text-2xl font-semibold text-blue-700 mb-3">
        3️⃣ Explore Careers
      </h3>
      <p className="text-lg text-gray-600">
        Discover careers that align with your unique profile.
      </p>
    </div>

    {/* 4 - Colleges */}
    <div className="how-card bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center">
      <img src={clg} alt="Colleges" className="w-1/2 mb-4" />
      <h3 className="text-2xl font-semibold text-blue-700 mb-3">
        4️⃣ Find Colleges
      </h3>
      <p className="text-lg text-gray-600">
        Get curated college recommendations based on your goals.
      </p>
    </div>

  </div>
</section>

{/* MISSION SECTION */}
<section className="bg-white py-20 px-6 transition-colors duration-300">
  <div className="max-w-4xl mx-auto text-center p-8">

    {/* Heading */}
    <h2 className="text-3xl font-bold text-gray-800 mb-6">
      Our Mission
    </h2>

    {/* Emotional Context Line */}
    <p className="text-gray-500 text-base mb-4 italic">
      Many students don’t lack talent — they lack clarity.
    </p>

    {/* Main Mission Statement */}
    <p className="text-lg text-gray-700 leading-relaxed font-medium">
      Our mission is to give every student the clarity they need to choose 
      the right stream, the right degree, and the right future.
    </p>

  </div>
</section>


      {/* FOOTER */}
      <Footer />

    </div>
  );
}
