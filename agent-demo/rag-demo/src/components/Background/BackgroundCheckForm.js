import React, { useState } from 'react';
import performBackgroundCheck from '../../services/mockBackgroundApi';

const BackgroundCheckForm = ({ cases, onCheckComplete }) => {
  const [selectedCase, setSelectedCase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCaseChange = (e) => {
    setSelectedCase(e.target.value);
  };

  const handlePerformCheck = async () => {
    if (!selectedCase) {
      setError('Please select a case to check');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get case metadata
      const caseData = cases.find(c => c.case_id === selectedCase);
      
      if (!caseData) {
        throw new Error('Case not found');
      }
      
      // Perform background check
      const checkResults = await performBackgroundCheck(caseData);
      
      // Pass the results to parent component
      onCheckComplete(checkResults, caseData);
    } catch (err) {
      console.error('Error performing background check:', err);
      setError('Failed to perform background check. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Group cases by country for easier selection
  const countriesMap = {};
  cases.forEach(item => {
    if (!countriesMap[item.country_of_origin]) {
      countriesMap[item.country_of_origin] = [];
    }
    countriesMap[item.country_of_origin].push(item);
  });

  const countries = Object.keys(countriesMap).sort();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Background Check
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            Perform a background check on an asylum applicant using the mock API.
            The check includes criminal record, identity verification, and watchlist checks.
          </p>
        </div>
        
        <div className="mt-5">
          <label htmlFor="case-select" className="block text-sm font-medium text-gray-700">
            Select Case
          </label>
          <select
            id="case-select"
            name="case-select"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={selectedCase}
            onChange={handleCaseChange}
          >
            <option value="">-- Select a case --</option>
            {countries.map(country => (
              <optgroup key={country} label={country}>
                {countriesMap[country].map(item => (
                  <option key={item.case_id} value={item.case_id}>
                    {item.case_id} - {item.applicant_gender}, {item.applicant_age} ({item.country_of_origin})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        
        {error && (
          <div className="mt-4 text-sm text-red-600">
            {error}
          </div>
        )}
        
        <div className="mt-5 flex items-center">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handlePerformCheck}
            disabled={loading || !selectedCase}
          >
            {loading ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
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
                Checking...
              </>
            ) : (
              'Perform Background Check'
            )}
          </button>
          
          {selectedCase && (
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                // Select a random case
                const randomIndex = Math.floor(Math.random() * cases.length);
                setSelectedCase(cases[randomIndex].case_id);
              }}
            >
              Random Case
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackgroundCheckForm;
