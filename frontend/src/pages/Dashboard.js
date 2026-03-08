import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state:", user);

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching profile for:", user.uid);

        const res = await axios.get(
          `http://localhost:5000/profile/${user.uid}`
        );

        console.log("PROFILE RESPONSE:", res.data);

        setProfile(res.data);

      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
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
        ) : !profile || profile.message ? (
          <div className="text-center text-gray-600 dark:text-gray-300">
            No assessments completed yet.
          </div>
        ) : (
          <div className="space-y-10">

            {/* ---------- RIASEC ---------- */}

            {profile.riasec && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">

                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                  Holland Code: {profile.riasec.holland_code}
                </h2>

                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 mb-8">
                  {profile.riasec.explanation}
                </p>

                <div className="mb-10">
                  <h3 className="text-2xl font-semibold mb-4">
                    Recommended Careers
                  </h3>

                  <div className="space-y-3">
                    {profile.riasec.top_careers?.map((career, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-blue-50 dark:bg-gray-700 flex justify-between"
                      >
                        <span>{career.career}</span>
                        <span className="text-blue-600 font-semibold">
                          {(career.match_score * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-4">
                    RIASEC Scores
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(profile.riasec.scores || {}).map(([key, value]) => (
                      <div
                        key={key}
                        className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center"
                      >
                        <p className="text-lg font-bold text-blue-600">{key}</p>
                        <p>{(value * 100).toFixed(1)}%</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ---------- MATH ---------- */}

            {profile.academic?.maths && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">

                <h2 className="text-2xl font-bold text-blue-600 mb-6">
                  Math Assessment
                </h2>

                {Object.entries(profile.academic.maths.report || {}).map(
                  ([domain, data]) => (
                    <div
                      key={domain}
                      className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg mb-3"
                    >
                      <p className="font-semibold">{domain}</p>
                      <p>Score: {(data.score * 100).toFixed(1)}%</p>
                      <p className="text-blue-600">{data.level}</p>
                    </div>
                  )
                )}

              </div>
            )}

            {/* ---------- SOCIAL ---------- */}

            {profile.academic?.social && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">

                <h2 className="text-2xl font-bold text-blue-600 mb-6">
                  Social Science Assessment
                </h2>

                {Object.entries(profile.academic.social.report || {}).map(
                  ([domain, data]) => (
                    <div
                      key={domain}
                      className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg mb-3"
                    >
                      <p className="font-semibold">{domain}</p>
                      <p>Score: {(data.score * 100).toFixed(1)}%</p>
                      <p className="text-green-600">{data.level}</p>
                    </div>
                  )
                )}

              </div>
            )}

            {/* ---------- STREAM ---------- */}

            {profile.academic?.overall && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">

                <h2 className="text-2xl font-bold text-blue-600 mb-6">
                  Academic Stream Recommendation
                </h2>

                <div className="p-6 bg-purple-50 dark:bg-gray-700 rounded-lg">

                  <p className="text-xl font-semibold text-purple-700">
                    {profile.academic.overall.recommendation.stream}
                  </p>

                  <p className="mt-2">
                    {profile.academic.overall.recommendation.reason}
                  </p>

                </div>

              </div>
            )}

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}