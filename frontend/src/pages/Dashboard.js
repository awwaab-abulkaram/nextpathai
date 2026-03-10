import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {

  const [profile, setProfile] = useState(null);
  const [streamRec, setStreamRec] = useState(null);
  const [collegeRec, setCollegeRec] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const COLORS = ["#3b82f6", "#e5e7eb"];

  const assessmentRoutes = {
    Science: "/assessment/science",
    Math: "/assessment/maths",
    Social: "/assessment/social",
    Riasec: "/assessment/riasec",
    Mbti: "/assessment/mbti",
    Aptitude: "/assessment/aptitude"
  };

  useEffect(() => {

    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (!user) {
        setLoading(false);
        return;
      }

      try {

        const res = await axios.get(
          `http://localhost:5000/profile/${user.uid}`
        );

        setProfile(res.data);

        const completed =
          res.data?.riasec &&
          res.data?.mbti &&
          res.data?.aptitude?.scores &&
          res.data?.academic?.maths?.normalized_scores &&
          res.data?.academic?.social?.normalized_scores &&
          res.data?.academic?.overall?.normalized_scores;

        if (completed) {

          const stream = await axios.get(
            `http://localhost:5000/recommend-stream/${user.uid}`
          );

          const colleges = await axios.get(
            `http://localhost:5000/recommend-colleges/${user.uid}`
          );

          setStreamRec(stream.data);
          setCollegeRec(colleges.data);

        }

      } catch (err) {
        console.error(err);
      }

      setLoading(false);

    });

    return () => unsubscribe();

  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center mt-20">No profile found</div>;
  }

  const sections = {
    Riasec: !!profile?.riasec,
    Mbti: !!profile?.mbti,
    Aptitude: !!profile?.aptitude?.scores,
    Math: !!profile?.academic?.maths?.normalized_scores,
    Social: !!profile?.academic?.social?.normalized_scores,
    Science: !!profile?.academic?.overall?.normalized_scores
  };

  const missingSections = Object.entries(sections)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  const completedSections = Object.values(sections).filter(Boolean).length;
  const totalSections = Object.keys(sections).length;

  const completion = (completedSections / totalSections) * 100;

  const pieData = [
    { name: "Completed", value: completion },
    { name: "Remaining", value: 100 - completion }
  ];

  const mathData = Object.entries(
    profile.academic?.maths?.normalized_scores || {}
  ).map(([key, val]) => ({
    name: key,
    score: val * 100
  }));

  const socialData = Object.entries(
    profile.academic?.social?.normalized_scores || {}
  ).map(([key, val]) => ({
    name: key,
    score: val * 100
  }));

  const scienceData = Object.entries(
    profile.academic?.overall?.normalized_scores || {}
  ).map(([key, val]) => ({
    name: key,
    score: val * 100
  }));

  return (

    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">

      <Navbar />

      <div className="flex-grow px-6 mt-20 max-w-6xl mx-auto space-y-12">

        <h1 className="text-4xl font-bold text-center text-blue-600">
          Welcome, {profile.name || "User"}
        </h1>

        {/* PROFILE COMPLETION */}
        <div className="dashboard">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Profile Completion
          </h2>

          <div className="flex justify-center">

            <PieChart width={250} height={250}>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>

          </div>

          <p className="text-center mt-4 text-lg">
            {completion.toFixed(0)}% Completed
          </p>

        </div>


        {/* MISSING ASSESSMENTS */}

        {missingSections.length > 0 && (

          <div className="bg-yellow-50 dark:bg-gray-800 p-8 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-4 text-yellow-700">
              Complete Remaining Assessments
            </h2>

            <p className="mb-6">
              Complete all assessments to access course and college recommender.
            </p>

            <div className="space-y-4">

              {missingSections.map((section) => (

                <div
                  key={section}
                  className="flex justify-between items-center p-4 bg-yellow-100 dark:bg-gray-700 rounded-lg"
                >

                  <span className="capitalize font-semibold">
                    {section} Assessment Incomplete
                  </span>

                  <button
                    onClick={() => navigate(assessmentRoutes[section])}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Start
                  </button>

                </div>

              ))}

            </div>

          </div>

        )}


        {/* RIASEC */}

        {profile.riasec && (

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-4">
              Holland Code: {profile.riasec.holland_code}
            </h2>

            <p className="text-gray-600 whitespace-pre-line">
              {profile.riasec.explanation}
            </p>

          </div>

        )}


        {/* MBTI */}

        {profile.mbti && (

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-4">
              MBTI Personality
            </h2>

            <p className="text-3xl font-bold text-indigo-600">
              {profile.mbti.personality}
            </p>

            <p className="mt-2 text-gray-600">
              Confidence: {(profile.mbti.confidence * 100).toFixed(1)}%
            </p>

          </div>

        )}


        {/* APTITUDE */}

        {profile.aptitude && (

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-6">
              General Aptitude Scores
            </h2>

            {Object.entries(profile.aptitude.scores || {}).map(([key,val]) => (
              <p key={key}>
                {key}: {(val * 100).toFixed(1)}%
              </p>
            ))}

          </div>

        )}


        {/* MATH GRAPH */}

        {mathData.length > 0 && (

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-6">
              Mathematics Performance
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mathData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>

          </div>

        )}


        {/* SOCIAL GRAPH */}

        {socialData.length > 0 && (

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-6">
              Social Science Performance
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={socialData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>

          </div>

        )}


        {/* SCIENCE GRAPH */}

        {scienceData.length > 0 && (

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-6">
              Science Performance
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scienceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>

          </div>

        )}


        {/* STREAM + COLLEGE RECOMMENDATIONS */}

        {completion >= 100 && streamRec && collegeRec && (

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-6">
              Recommended Path
            </h2>

            <p className="text-xl mb-4">
              Stream: <span className="font-semibold">
                {streamRec.recommended_streams?.[0]?.stream}
              </span>
            </p>

            <h3 className="text-xl font-bold mb-4">
              Top Colleges
            </h3>

            {collegeRec.top_colleges?.map((c) => (
              <div
                key={c.rank}
                className="p-4 bg-gray-100 dark:bg-gray-700 rounded mb-3"
              >
                <p className="font-semibold">
                  {c.rank}. {c.college_name}
                </p>
                <p>Rating: {c.rating}</p>
                <p>Admission Fit: {c.admission_fit}</p>
              </div>
            ))}

          </div>

        )}

      </div>
        </div>
      <Footer />

    </div>

  );
}