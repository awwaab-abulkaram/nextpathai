import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function AptitudeQuiz() {

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ==============================
  // LOAD SAVED PROGRESS
  // ==============================

  useEffect(() => {

    const saved = localStorage.getItem("aptitudeProgress");

    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed.answers || {});
      setCurrent(parsed.current || 0);
    }

  }, []);

  // ==============================
  // FETCH QUESTIONS
  // ==============================

  useEffect(() => {

    axios
      .get("http://localhost:5000/aptitude/questions")
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setLoading(false);
      });

  }, []);

  // ==============================
  // AUTO SAVE PROGRESS
  // ==============================

  useEffect(() => {

    localStorage.setItem(
      "aptitudeProgress",
      JSON.stringify({
        answers,
        current
      })
    );

  }, [answers, current]);

  if (loading || questions.length === 0) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-blue-600">Loading Questions...</p>
      </div>
    );

  }

  // ==============================
  // SELECT ANSWER
  // ==============================

  const handleSelect = (option) => {

    setAnswers({
      ...answers,
      [current]: option
    });

  };

  // ==============================
  // NAVIGATION
  // ==============================

  const next = () => {

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }

  };

  const prev = () => {

    if (current > 0) {
      setCurrent(current - 1);
    }

  };

  // ==============================
  // SUBMIT QUIZ
  // ==============================

  const handleSubmit = async () => {

    try {

      setSubmitting(true);

      const res = await axios.post(
        "http://localhost:5000/aptitude/submit",
        {
          answers: answers
        }
      );

      setResult(res.data);

      // Save result locally
      localStorage.setItem(
        "aptitudeResult",
        JSON.stringify(res.data)
      );

      // Clear saved progress
      localStorage.removeItem("aptitudeProgress");

      // Send result to backend profile API
      await axios.post(
        "http://localhost:5000/profile/save-aptitude",
        {
          result: res.data
        }
      );

      setSubmitting(false);

    } catch (error) {

      console.error("Submission error:", error);
      setSubmitting(false);

    }

  };

  const progress = ((current + 1) / questions.length) * 100;

  const q = questions[current];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center px-6 mt-20">

        {result ? (

          <div className="bg-white dark:bg-gray-800 w-full max-w-3xl p-8 rounded-2xl shadow-lg">

            <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
              Aptitude Result
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-8">

              {Object.entries(result.scores).map(([key, value]) => (

                <div
                  key={key}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center"
                >
                  <p className="font-semibold text-gray-700 dark:text-gray-200">
                    {key}
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    {value.toFixed(1)}%
                  </p>
                </div>

              ))}

            </div>

            <div className="text-center mb-4">

              <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Engineering Score: {result.engineering}%
              </p>

              <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Commerce Score: {result.commerce}%
              </p>

            </div>

            <div className="text-center mt-6">

              <p className="text-2xl font-bold text-blue-600">
                Recommended Stream: {result.recommendation}
              </p>

              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Confidence: {result.confidence}%
              </p>

            </div>

          </div>

        ) : (

          <>

            <div className="w-full max-w-2xl mb-6">

              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full">

                <div
                  className="h-3 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />

              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-right">
                Question {current + 1} of {questions.length}
              </p>

            </div>

            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl p-8 rounded-2xl shadow-lg">

              <AnimatePresence mode="wait">

                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >

                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
                    {q.question}
                  </h2>

                  <div className="space-y-4">

                    {Object.values(q.options).map((option, i) => (

                      <div
                        key={i}
                        onClick={() => handleSelect(option)}
                        className={`quiz-opts cursor-pointer p-4 rounded-xl border transition-all duration-200
                        ${
                          answers[current] === option
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-blue-500"
                        }`}
                      >
                        {option}
                      </div>

                    ))}

                  </div>

                </motion.div>

              </AnimatePresence>

              <div className="flex justify-between mt-8">

                <button
                  onClick={prev}
                  disabled={current === 0}
                  className="px-6 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white disabled:opacity-50"
                >
                  Previous
                </button>

                {current === questions.length - 1 ? (

                  <button
                    onClick={handleSubmit}
                    disabled={!answers[current] || submitting}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>

                ) : (

                  <button
                    onClick={next}
                    disabled={!answers[current]}
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