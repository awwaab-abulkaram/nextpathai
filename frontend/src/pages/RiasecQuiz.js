import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { getAuth } from "firebase/auth";

export default function RiasecQuiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const scaleOptions = [
    { label: "Strongly Disagree", value: 1 },
    { label: "Disagree", value: 2 },
    { label: "Neutral", value: 3 },
    { label: "Agree", value: 4 },
    { label: "Strongly Agree", value: 5 },
  ];

  // Fetch + Flatten Questions
  useEffect(() => {
    axios
      .get("http://localhost:5000/riasec/questions")
      .then((res) => {
        const data = res.data;
        const formatted = [];

        Object.keys(data).forEach((dimension) => {
          data[dimension].forEach((q) => {
            formatted.push({
              id: q.id,
              text: q.text,
              dimension: dimension,
            });
          });
        });

        setQuestions(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setLoading(false);
      });
  }, []);

  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-blue-600">Loading Questions...</p>
      </div>
    );
  }

  const handleSelect = (value) => {
    setAnswers({
      ...answers,
      [questions[current].id]: value,
    });
  };

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

const handleSubmit = async () => {
  try {
    setSubmitting(true);

    const formattedResponses = {};
    questions.forEach((q) => {
      formattedResponses[q.id] = answers[q.id] ?? 0;
    });

    const res = await axios.post("http://localhost:5000/riasec", {
      responses: formattedResponses,
    });

    setResult(res.data);

    // ✅ Save locally
    localStorage.setItem("riasecResult", JSON.stringify(res.data));

    // ✅ Save to backend (authenticated)
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      await axios.post("http://localhost:5000/profile/save-riasec", {
        uid: user.uid,
        riasec: res.data,
      });
    }

    setSubmitting(false);

  } catch (error) {
    console.error("Submission error:", error);
    setSubmitting(false);
  }
};

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center px-6 mt-20">

        {result ? (
          // ================= RESULT VIEW =================
          <div className="bg-white dark:bg-gray-800 w-full max-w-3xl p-8 rounded-2xl shadow-lg">

            <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
              Your Holland Code: {result.holland_code}
            </h2>

            <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 mb-8">
              {result.explanation}
            </p>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Top Career Matches
              </h3>

              <div className="space-y-3">
                {result.top_careers.map((career, index) => (
                  <div
                    key={index}
                    className="quiz-opts p-4 rounded-lg bg-blue-50 dark:bg-gray-700 flex justify-between items-center"
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

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                RIASEC Scores
              </h3>

              <div className="grid grid-cols-3 gap-4">
                {Object.entries(result.scores).map(([key, value]) => (
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
          // ================= QUIZ VIEW =================
          <>
            {/* Progress Bar */}
            <div className="w-full max-w-2xl mb-6">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-3 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-right">
                Question {current + 1} of {questions.length}
              </p>
            </div>

            {/* Question Card */}
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
                    {questions[current].text}
                  </h2>

                  <div className="space-y-4">
                    {scaleOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={`quiz-opts cursor-pointer p-4 rounded-xl border transition-all duration-200 
                          ${
                            answers[questions[current].id] === option.value
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-blue-500"
                          }`}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="button-container flex justify-between mt-8">
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
                    disabled={!answers[questions[current].id] || submitting}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                ) : (
                  <button
                    onClick={next}
                    disabled={!answers[questions[current].id]}
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