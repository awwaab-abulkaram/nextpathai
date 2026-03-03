import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import RiasecQuiz from "./pages/RiasecQuiz";
import AcademicQuizScience from "./pages/AcademicQuizScience";
function App() {
  return (
    <Router>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/assessment/riasec" element={<RiasecQuiz />} />
          <Route path="/assessment/science" element={<AcademicQuizScience />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
