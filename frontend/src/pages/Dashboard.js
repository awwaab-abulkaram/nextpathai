// src/pages/Dashboard.jsx
import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import { auth } from "../firebase";

import {
  FiBell,
  FiUser,
  FiPieChart,
  FiBookOpen,
  FiArrowRight,
  FiEdit2,
} from "react-icons/fi";
import { MdSchool, MdTimeline, MdOutlineLibraryBooks } from "react-icons/md";
import { AiOutlineCheckCircle, AiOutlineClockCircle } from "react-icons/ai";
import { BsFillChatDotsFill } from "react-icons/bs";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) setUser(firebaseUser);
      else {
        const offlineUser = localStorage.getItem("offlineUser");
        setUser(offlineUser ? JSON.parse(offlineUser) : null);
      }
    });
    return () => unsub();
  }, []);

  const profile = useMemo(
    () => ({
      name:
        user?.displayName ||
        (user?.email ? user.email.split("@")[0] : "Guest Student"),
      class: "12th Grade",
      assessmentStatus: "Not started",
      profileCompletion: 38,
      avatar:
        user?.photoURL ||
        "https://ui-avatars.com/api/?name=Student&background=607D8B&color=fff",
      location: "India",
    }),
    [user]
  );

  const quickActions = [
    { id: "assessment", title: "Take Psychometric Test", subtitle: "Understand strengths", icon: FiBookOpen },
    { id: "profile", title: "Complete Profile", subtitle: "Better recommendations", icon: FiUser },
    { id: "recommend", title: "View Recommendations", subtitle: "AI matched careers", icon: FiPieChart },
    { id: "careers", title: "Explore Careers", subtitle: "Browse career paths", icon: MdTimeline },
    { id: "colleges", title: "Find Govt Colleges", subtitle: "Filtered for you", icon: MdSchool },
    { id: "resources", title: "Resources Hub", subtitle: "Guides & articles", icon: MdOutlineLibraryBooks },
  ];

  const journeySteps = [
    { id: 1, title: "Create Profile", status: "done" },
    { id: 2, title: "Take Assessment", status: "pending" },
    { id: 3, title: "Get AI Recommendations", status: "pending" },
    { id: 4, title: "Explore Courses", status: "pending" },
    { id: 5, title: "Find Colleges", status: "pending" },
  ];

  const recommendations = [
    { title: "Data Science", fit: 87, desc: "Strong analytical & math aptitude" },
    { title: "Product Design", fit: 72, desc: "Creative + problem solver" },
    { title: "Business Analytics", fit: 68, desc: "Good for hybrid roles" },
  ];

  const colleges = [
    { name: "Govt. Engineering College A", city: "City A", cutoff: "85-90%" },
    { name: "Govt. Arts & Science College B", city: "City B", cutoff: "75-80%" },
  ];

  const notifications = [
    { id: 1, text: "Assessment available: 'Aptitude Basic'", time: "2d ago", unread: true },
    { id: 2, text: "Recommendation: Data Science (87% fit)", time: "5d ago" },
    { id: 3, text: "Admission deadline for College A approaching", time: "1w ago" },
  ];

  const handleQuickAction = (id) => alert(`Clicked: ${id}`);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
      <Navbar />

      <div className="flex flex-1 pt-4 px-4 md:px-8 dashboard-top">
        {/* TOP HEADER */}
<div className="flex items-center justify-between mb-8">

  {/* LEFT: Greeting */}
  <div>
    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
      Welcome back,{" "}
      <span className="text-blue-600 dark:text-blue-400">
        {profile.name?.split(" ")[0]}
      </span>
    </h1>

    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
      Your guidance journey:{" "}
      <span className="font-medium">{profile.profileCompletion}% complete</span>
    </p>
  </div>

  {/* RIGHT: Notifications + Mini Profile */}
  <div className="flex items-center gap-5">

    {/* Notification Bell */}
    <div className="relative">
      <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
        <FiBell size={18} />
      </button>

      {/* unread count */}
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
        3
      </span>
    </div>

    {/* MINI PROFILE */}
    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1">
      <img
        src={profile.avatar}
        alt="avatar"
        className="w-9 h-9 rounded-full object-cover"
      />

      <div className="leading-tight">
        <p className="text-sm font-medium">{profile.name}</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          {profile.class} • {profile.location}
        </p>
      </div>
    </div>

  </div>
</div>

      </div>
    </div>
  );
}



