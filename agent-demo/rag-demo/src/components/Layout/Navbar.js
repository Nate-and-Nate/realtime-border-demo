import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-8 h-8 text-blue-600"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span className="font-bold text-xl text-gray-900">AsylumAI Demo</span>
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link 
              to="/summary" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/summary' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Interview Summaries
            </Link>
            
            <Link 
              to="/search" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/search' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Semantic Search
            </Link>
            
            <Link 
              to="/discrepancy" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/discrepancy' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Discrepancy Analysis
            </Link>
            
            <Link 
              to="/priority" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/priority' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Priority Metrics
            </Link>
            
            <Link 
              to="/background" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/background' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Background Checks
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className="block h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className="sm:hidden hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            to="/summary" 
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              location.pathname === '/summary' 
                ? 'border-blue-500 text-blue-700 bg-blue-50' 
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }`}
          >
            Interview Summaries
          </Link>
          
          <Link 
            to="/search" 
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              location.pathname === '/search' 
                ? 'border-blue-500 text-blue-700 bg-blue-50' 
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }`}
          >
            Semantic Search
          </Link>
          
          <Link 
            to="/discrepancy" 
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              location.pathname === '/discrepancy' 
                ? 'border-blue-500 text-blue-700 bg-blue-50' 
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }`}
          >
            Discrepancy Analysis
          </Link>
          
          <Link 
            to="/priority" 
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              location.pathname === '/priority' 
                ? 'border-blue-500 text-blue-700 bg-blue-50' 
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }`}
          >
            Priority Metrics
          </Link>
          
          <Link 
            to="/background" 
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              location.pathname === '/background' 
                ? 'border-blue-500 text-blue-700 bg-blue-50' 
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }`}
          >
            Background Checks
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
