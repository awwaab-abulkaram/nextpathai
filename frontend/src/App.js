import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import RiasecQuiz from "./pages/RiasecQuiz";
import AcademicQuizScience from "./pages/AcademicQuizScience";
import AcademicQuizMath from "./pages/AcademicQuizMath";
import AcademicQuizSocial from "./pages/AcademicQuizSocial";
import AptitudeQuiz from "./pages/AptitudeQuiz";
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
          <Route path="/assessment/maths" element={<AcademicQuizMath />} />
          <Route path="/assessment/social" element={<AcademicQuizSocial />} />
          <Route path="/assessment/aptitude" element={<AptitudeQuiz/>} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
