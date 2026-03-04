import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function AcademicQuizSocial() {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const QUESTIONS_PER_PAGE = 5;

  // ================= FETCH QUESTIONS =================
  useEffect(() => {
    axios
      .get("http://localhost:5000/social/questions")
      .then((res) => {
        setQuestions(res.data.questions);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching math questions:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-blue-600">Loading Math Quiz...</p>
      </div>
    );
  }

  // ================= PAGINATION =================
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );

  const handleSelect = (qid, option) => {
    setAnswers({
      ...answers,
      [qid]: option,
    });
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const res = await axios.post(
        "http://localhost:5000/social/submit",
        {
          responses: answers,
        }
      );

      setResult(res.data);
      setSubmitting(false);
      window.scrollTo(0, 0);

    } catch (error) {
      console.error("Submission error:", error);
      setSubmitting(false);
    }
  };

  const progress = ((currentPage + 1) / totalPages) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="flex-grow flex flex-col items-center px-6 mt-20">

        {result ? (
          // ================= RESULT VIEW =================
          <div className="bg-white dark:bg-gray-800 w-full max-w-3xl p-8 rounded-2xl shadow-lg">

            <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">
              Social Sciences Performance Report
            </h2>

            <div className="space-y-6">
              {Object.entries(result.report).map(([domain, data]) => (
                <div
                  key={domain}
                  className="quiz-opts p-6 rounded-xl bg-blue-50 dark:bg-gray-700"
                >
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {domain}
                  </h3>

                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Score: {(data.score * 100).toFixed(1)}%
                  </p>

                  <p className="mt-1 font-medium text-blue-600">
                    Level: {data.level}
                  </p>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            {result.recommendation && (
              <div className="mt-10 p-6 bg-green-50 dark:bg-gray-700 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Suggested Path
                </h3>

                <p className="text-green-700 font-medium mt-2">
                  {result.recommendation.path}
                </p>

                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {result.recommendation.reason}
                </p>
              </div>
            )}

          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="w-full max-w-3xl mb-6">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-3 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-right">
                Page {currentPage + 1} of {totalPages}
              </p>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-gray-800 w-full max-w-3xl p-8 rounded-2xl shadow-lg">

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-8">

                    {currentQuestions.map((q, index) => (
                      <div key={q.id}>

                        {/* Domain label */}
                        <p className="text-sm text-blue-600 font-semibold mb-1">
                          {q.domain}
                        </p>

                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                          {startIndex + index + 1}. {q.text}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.options.map((option, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleSelect(q.id, option)}
                              className={`quiz-opts cursor-pointer p-3 rounded-lg border transition-all duration-200 
                                ${
                                  answers[q.id] === option
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-blue-500"
                                }`}
                            >
                              {option}
                            </div>
                          ))}
                        </div>

                      </div>
                    ))}

                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-10">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="px-6 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white disabled:opacity-50"
                >
                  Previous
                </button>

                {currentPage === totalPages - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                ) : (
                  <button
                    onClick={nextPage}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white"
                  >
                    Next
                  </button>
                )}
              </div>

            </div>
          </>
        )}

      </div>

      <Footer />
    </div>
  );
}