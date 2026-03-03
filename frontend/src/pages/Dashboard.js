import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { getAuth } from "firebase/auth";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile on mount
  useEffect(() => {
    // 1️⃣ Load from localStorage first (offline safe)
    const stored = localStorage.getItem("riasecResult");
    if (stored) {
      setProfile(JSON.parse(stored));
    }

    // 2️⃣ Fetch from backend (if logged in)
    const fetchProfile = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const res = await axios.get(
            `http://localhost:5000/profile/${user.uid}`
          );

          if (res.data && res.data.riasec) {
            setProfile(res.data.riasec);

            // Sync localStorage with backend version
            localStorage.setItem(
              "riasecResult",
              JSON.stringify(res.data.riasec)
            );
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="flex-grow px-6 mt-20 max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-10 text-center">
          Your Dashboard
        </h1>

        {loading ? (
          <div className="text-center text-blue-600 text-lg">
            Loading profile...
          </div>
        ) : profile ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">

            {/* Holland Code */}
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
              Holland Code: {profile.holland_code}
            </h2>

            {/* Explanation */}
            <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 mb-8">
              {profile.explanation}
            </p>

            {/* Top Careers */}
            <div className="mb-10">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Recommended Careers
              </h3>

              <div className="space-y-3">
                {profile.top_careers.map((career, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-blue-50 dark:bg-gray-700 flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {career.career}
                    </span>
                    <span className="text-blue-600 font-semibold">
                      {(career.match_score * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scores */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                RIASEC Scores
              </h3>

              <div className="grid grid-cols-3 gap-4">
                {Object.entries(profile.scores).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center"
                  >
                    <p className="text-lg font-bold text-blue-600">{key}</p>
                    <p className="text-gray-800 dark:text-gray-100">
                      {(value * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p className="mb-4 text-lg">
              You haven't taken the RIASEC assessment yet.
            </p>
            <a
              href="/assessment/riasec"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Take Assessment
            </a>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}