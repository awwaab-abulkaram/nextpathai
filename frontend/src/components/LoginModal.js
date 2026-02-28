import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function LoginModal({ onClose, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // -------------------------------------------
  // OFFLINE MODE HANDLER
  // -------------------------------------------
  const handleOfflineLogin = () => {
    const fakeUser = {
      uid: "offline-user",
      email: "offline@example.com",
      name: "Offline User",
      mode: "offline",
    };

    localStorage.setItem("offlineUser", JSON.stringify(fakeUser));
    alert("Offline mode activated!");
    onClose();
  };

  // -------------------------------------------
  // Email Login
  // -------------------------------------------
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      onClose();
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Logged in with Google!");
      onClose();
    } catch (err) {
      setError("Google login failed");
    }
  };

  // Anonymous Login
  const handleAnonymousLogin = async () => {
    setError("");
    try {
      await signInAnonymously(auth);
      alert("Logged in anonymously!");
      onClose();
    } catch (err) {
      setError("Anonymous login failed");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl w-80 sm:w-96 relative animate-fade-in-down">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 dark:text-gray-400 text-xl hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          ✖
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 text-center">
          Login
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        {/* Main Content */}
        <div className="flex flex-col space-y-4">

          {/* Email Login Form */}
          <form className="flex flex-col space-y-4" onSubmit={handleEmailLogin}>
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700
                         text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                         rounded-lg px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700
                         text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                         rounded-lg px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="bg-blue-600 dark:bg-blue-500 text-white rounded-lg py-2
                         hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>

          {/* Social / Guest Logins */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full py-2.5 
                         bg-white dark:bg-gray-700 
                         text-gray-700 dark:text-gray-300 
                         border-2 border-gray-300 dark:border-gray-600 
                         rounded-lg font-medium 
                         hover:bg-gray-100 dark:hover:bg-gray-600 
                         transition-all duration-300"
            >
              Continue with Google
            </button>

            <button
              onClick={handleAnonymousLogin}
              className="w-full py-2.5
                         bg-white dark:bg-gray-700 
                         text-gray-700 dark:text-gray-300 
                         border-2 border-gray-300 dark:border-gray-600 
                         rounded-lg font-medium 
                         hover:bg-gray-100 dark:hover:bg-gray-600 
                         transition-all duration-300"
            >
              Continue as Guest
            </button>

            {/* NEW — Offline mode */}
            <button
              onClick={handleOfflineLogin}
              className="w-full py-2.5
                         bg-white dark:bg-gray-700 
                         text-gray-700 dark:text-gray-300 
                         border-2 border-gray-300 dark:border-gray-600 
                         rounded-lg font-medium 
                         hover:bg-gray-100 dark:hover:bg-gray-600 
                         transition-all duration-300"
            >
              Offline Mode (Fail-safe)
            </button>
          </div>

          {/* Signup Switch */}
          <p className="text-sm text-center text-gray-600 dark:text-gray-300">
            Don’t have an account?{" "}
            <span
              onClick={onSignup}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}
