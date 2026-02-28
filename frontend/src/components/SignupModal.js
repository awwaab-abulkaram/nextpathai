import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function SignupModal({ onClose, onLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        uid: user.uid,
        createdAt: new Date(),
      });

      alert("Account created successfully!");
      onClose(); // close modal
    } catch (err) {
      setError(err.message);
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
          Sign Up
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-2">
            {error}
          </p>
        )}

        {/* SIGN UP FORM */}
        <form className="flex flex-col space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700
                       text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                       rounded-lg px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

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
            Create Account
          </button>
        </form>

        {/* Switch to Login */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-4">
          Already have an account?{" "}
          <span
            onClick={onLogin}
            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
