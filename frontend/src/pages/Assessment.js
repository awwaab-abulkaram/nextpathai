import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function AssessmentHub() {
  const navigate = useNavigate();

  const domains = [
    {
      id: "psychometric",
      title: "Psychometric Analysis",
      description:
        "Evaluate your interests, personality traits, and aptitude using structured scientific assessments.",
      quizzes: [
        { id: 1, name: "RIASEC Interest Test", route: "/assessment/riasec" },
        { id: 2, name: "Personality Assessment", route: "/assessment/personality" },
        { id: 3, name: "Aptitude Evaluation", route: "/assessment/aptitude" },
      ],
    },
    {
      id: "academic",
      title: "Academic Assessment",
      description:
        "Evaluate your interests, personality traits, and aptitude using structured scientific assessments.",
      quizzes: [
        { id: 1, name: "Science Assessment", route: "/assessment/science" },
        { id: 2, name: "Mathematical Assessment", route: "/assessment/maths" },
        { id: 3, name: "Social Sciences", route: "/assessment/social" },
      ],
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="flex-grow px-6 mt-20">
        <div className="max-w-6xl mx-auto">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="button-container bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-10"
            >
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                {domain.title}
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {domain.description}
              </p>

              <div className="assess-dom grid grid-cols-1 md:grid-cols-3 gap-6">
                {domain.quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="bg-blue-50 dark:bg-gray-700 p-6 rounded-xl shadow hover:shadow-md transition flex flex-col justify-between"
                  >
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4">
                      {quiz.name}
                    </h3>

                    <button
                      onClick={() => navigate(quiz.route)}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                    >
                      Start Test
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>

      <Footer />
    </div>
  );
}