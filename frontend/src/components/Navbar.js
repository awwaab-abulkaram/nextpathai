import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Modals
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Auth user (Firebase OR Offline)
  const [user, setUser] = useState(null);




  // Firebase + Offline Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        const offlineUser = localStorage.getItem("offlineUser");
        setUser(offlineUser ? JSON.parse(offlineUser) : null);
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    // Clear offline mode user
    localStorage.removeItem("offlineUser");

    // Try Firebase logout
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Offline logout only:", err);
    }

    setUser(null);
    alert("Logged out");
  };

  // Switch modals
  const openSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const openLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            NexPath<span className="text-gray-600 dark:text-gray-400">AI</span>
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">

            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Home
            </Link>

            <Link
              to="/assessment"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Assessment
            </Link>

            <Link
              to="/dashboard"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Dashboard
            </Link>

            {/* USER LOGGED-IN */}
            {user ? (
              <>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {user.mode === "offline" ? (
                    <span className="text-yellow-500 font-semibold">
                      Offline User
                    </span>
                  ) : user.displayName ? (
                    user.displayName.split(" ")[0]
                  ) : user.isAnonymous ? (
                    "Guest"
                  ) : (
                    user.email
                  )}
                </span>

                <button
                  onClick={handleLogout}
                  className="
                    px-5 py-2 text-blue-600 dark:text-blue-400 
                    border-2 border-blue-600 dark:border-blue-400 
                    rounded-lg hover:bg-blue-600 hover:text-white 
                    dark:hover:bg-blue-500 transition
                  "
                >
                  Logout
                </button>
              </>
            ) : (
              /* USER LOGGED OUT */
              <button
                onClick={() => setShowLogin(true)}
                className="
                  px-5 py-2.5 text-blue-600 dark:text-blue-400 
                  border-2 border-blue-600 dark:border-blue-400 
                  rounded-lg font-medium 
                  hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 
                  transition-all duration-300
                "
              >
                Login
              </button>
            )}

            {/* <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} /> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center space-y-3 py-3">

              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Home
              </Link>

              <Link
                to="/assessment"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Assessment
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Dashboard
              </Link>

              {/* Mobile: User Controls */}
              {user ? (
                <>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {user.mode === "offline" ? (
                      <span className="text-yellow-500 font-semibold">
                        Offline User
                      </span>
                    ) : user.displayName ? (
                      user.displayName.split(" ")[0]
                    ) : user.isAnonymous ? (
                      "Guest"
                    ) : (
                      user.email
                    )}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="
                      px-5 py-2 
                      text-red-600 dark:text-red-400 
                      border-2 border-red-600 dark:border-red-400 
                      rounded-lg 
                      hover:bg-red-600 hover:text-white 
                      dark:hover:bg-red-500 
                      transition
                    "
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="
                    px-5 py-2 text-blue-600 dark:text-blue-400 
                    border-2 border-blue-600 dark:border-blue-400 
                    rounded-lg hover:bg-blue-600 hover:text-white 
                    dark:hover:bg-blue-500 transition
                  "
                >
                  Login
                </button>
              )}

             
            </div>
          </div>
        )}
      </nav>

      {/* 🔵 LOGIN MODAL */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSignup={openSignup}
        />
      )}

      {/* 🟢 SIGNUP MODAL */}
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onLogin={openLogin}
        />
      )}
    </>
  );
}
