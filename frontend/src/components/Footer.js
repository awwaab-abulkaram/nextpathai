export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 py-10 text-center transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Brand */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">
          NexPath<span className="text-blue-600 dark:text-blue-400">AI</span>
        </h2>

        {/* Subtext */}
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 transition-colors">
          Empowering smarter academic and career decisions with AI-driven insights.
        </p>
      </div>
    </footer>
  );
}
