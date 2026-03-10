import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { getAuth } from "firebase/auth";

import mbtiQuestions from "./mbti_questions.json";

export default function MBTIQuiz() {

  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const QUESTIONS_PER_PAGE = 10;
  const TOTAL_PAGES = 6;

  const scaleOptions = [
    { label: "Strongly Disagree", value: 1 },
    { label: "Disagree", value: 2 },
    { label: "Neutral", value: 3 },
    { label: "Agree", value: 4 },
    { label: "Strongly Agree", value: 5 },
  ];

  useEffect(() => {
    setQuestions(mbtiQuestions);
    setLoading(false);
  }, []);

  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-blue-600">Loading Questions...</p>
      </div>
    );
  }

  const start = page * QUESTIONS_PER_PAGE;
  const end = start + QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(start, end);

  const handleSelect = (id, value) => {
    setAnswers({
      ...answers,
      [id]: value,
    });
  };

  const pageAnswered = () => {
    return currentQuestions.every((q) => answers[q.id]);
  };

  const nextPage = () => {
    if (page < TOTAL_PAGES - 1 && pageAnswered()) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

const handleSubmit = async () => {

  try {

    setSubmitting(true);

    const formattedAnswers = questions.map((q) => answers[q.id] ?? 0);

    const auth = getAuth();
    const user = auth.currentUser;

    const res = await axios.post("http://localhost:5000/predict-mbti", {
      uid: user?.uid,
      answers: formattedAnswers
    });

    setResult(res.data);

    localStorage.setItem("mbtiResult", JSON.stringify(res.data));

    setSubmitting(false);

  } catch (error) {

    console.error("Submission error:", error);
    setSubmitting(false);

  }
};

  const progress = ((page + 1) / TOTAL_PAGES) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center px-6 mt-20">

        {result ? (

          // ================= RESULT =================

          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl p-8 rounded-2xl shadow-lg text-center">

            <h2 className="text-3xl font-bold text-blue-600 mb-4">
              Your MBTI Type
            </h2>

            <p className="text-5xl font-bold text-gray-800 dark:text-white mb-6">
              {result.personality}
            </p>

            <p className="text-lg text-gray-600 dark:text-gray-300">
              Confidence: {(Number(result.confidence) * 100).toFixed(1)}%
            </p>

          </div>

        ) : (

          <>
            {/* Progress */}
            <div className="w-full max-w-3xl mb-6">

              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-3 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-right">
                Page {page + 1} of {TOTAL_PAGES}
              </p>

            </div>

            {/* Question Card */}

            <div className="bg-white dark:bg-gray-800 w-full max-w-3xl p-8 rounded-2xl shadow-lg">

              <AnimatePresence mode="wait">

                <motion.div
                  key={page}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >

                  <div className="space-y-6">

                    {currentQuestions.map((q) => (

                      <div key={q.id}>

                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                          {q.question}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

                          {scaleOptions.map((option) => (

                            <div
                              key={option.value}
                              onClick={() =>
                                handleSelect(q.id, option.value)
                              }
                              className={`cursor-pointer p-3 rounded-lg border text-center transition-all duration-200
                              ${
                                answers[q.id] === option.value
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-blue-500"
                              }`}
                            >
                              {option.label}
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
                  disabled={page === 0}
                  className="px-6 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white disabled:opacity-50"
                >
                  Previous
                </button>

                {page === TOTAL_PAGES - 1 ? (

                  <button
                    onClick={handleSubmit}
                    disabled={!pageAnswered() || submitting}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>

                ) : (

                  <button
                    onClick={nextPage}
                    disabled={!pageAnswered()}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
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