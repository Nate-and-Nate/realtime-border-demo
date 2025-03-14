import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';

const FeatureCard = ({ title, description, icon, linkTo }) => {
  return (
    <Link 
      to={linkTo} 
      className="hover-card bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-all duration-200"
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-gradient w-12 h-12 rounded-md flex items-center justify-center text-white">
            {icon}
          </div>
          <div className="ml-5">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const StatCard = ({ title, value, change, icon }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
        {change && (
          <div className="mt-3 text-sm">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${change.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {change.positive ? '↑' : '↓'} {change.value}
            </span>
            <span className="ml-1 text-gray-500">{change.period}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  const { casesMetadata, loading, error } = useContext(AppContext);
  
  // Calculate some stats based on the data
  const totalCases = casesMetadata.length;
  const grantedCases = casesMetadata.filter(c => c.decision_outcome === "Granted").length;
  const deniedCases = casesMetadata.filter(c => c.decision_outcome === "Denied").length;
  const pendingCases = casesMetadata.filter(c => 
    c.decision_outcome === "Referred to Immigration Court" ||
    c.decision_outcome === "Administrative Closure"
  ).length;
  
  // Calculate top countries of origin
  const countryData = {};
  casesMetadata.forEach(c => {
    countryData[c.country_of_origin] = (countryData[c.country_of_origin] || 0) + 1;
  });
  
  const topCountries = Object.entries(countryData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country, count]) => ({ country, count }));
  
  return (
    <div>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">AsylumAI Demo</h1>
          <p className="mt-2 text-gray-600">
            Showcasing how AI can enhance the asylum processing system
          </p>
        </div>
      </div>
      
      {error && (
        <div className="max-w-7xl mx-auto py-4 px-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
            {error}
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="max-w-7xl mx-auto py-12 px-4 text-center">
          <svg 
            className="spinner mx-auto h-12 w-12 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-500">Loading case data...</p>
        </div>
      ) : (
        <>
          {/* Stats Section */}
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Case Overview</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                title="Total Cases" 
                value={totalCases} 
                icon={
                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
              <StatCard 
                title="Granted Cases" 
                value={grantedCases} 
                change={{ positive: true, value: "28%", period: "approval rate" }}
                icon={
                  <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard 
                title="Denied Cases" 
                value={deniedCases} 
                change={{ positive: false, value: "50%", period: "denial rate" }}
                icon={
                  <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard 
                title="Pending/Referred Cases" 
                value={pendingCases} 
                icon={
                  <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>
          </div>
          
          {/* Features Section */}
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">AI-Powered Features</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                title="Interview Summaries" 
                description="Generate concise summaries of asylum interviews using AI" 
                linkTo="/summary" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
              <FeatureCard 
                title="Semantic Search" 
                description="Search across interview transcripts and summaries using natural language" 
                linkTo="/search" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              <FeatureCard 
                title="Discrepancy Analysis" 
                description="AI-powered comparison to find inconsistencies between interviews" 
                linkTo="/discrepancy" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                }
              />
              <FeatureCard 
                title="Priority Metrics" 
                description="Create custom qualitative prioritization metrics using natural language" 
                linkTo="/priority" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                }
              />
              <FeatureCard 
                title="Background Checks" 
                description="Mock API for simulating safety and background checks with realistic probabilities" 
                linkTo="/background" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
              />
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Top Countries of Origin</h3>
                  <ul className="mt-3 space-y-2">
                    {topCountries.map(({ country, count }) => (
                      <li key={country} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{country}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {count} cases ({((count / totalCases) * 100).toFixed(1)}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
