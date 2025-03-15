import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ searchData, query, filters }) => {
  const [expandedCase, setExpandedCase] = useState(null);

  if (!searchData) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or filters.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { results, response, resultCount } = searchData;

  if (results.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or filters.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to render HTML with highlighting
  const renderHtml = (html) => {
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // Handle case expansion
  const toggleExpand = (caseId) => {
    if (expandedCase === caseId) {
      setExpandedCase(null);
    } else {
      setExpandedCase(caseId);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Search Results
          </h3>
          <span className="text-sm text-gray-500">
            {resultCount} {resultCount === 1 ? 'result' : 'results'} found
          </span>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Query:</span> {query}
          </p>
          {Object.entries(filters).some(([key, value]) => value) && (
            <div className="mt-1 flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => 
                value ? (
                  <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}
                  </span>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* AI-Generated Response */}
      {response && (
        <div className="px-4 py-4 sm:px-6 bg-blue-50 border-b border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-2">AI Assistant Summary</h4>
          <div className="text-sm text-gray-700 prose max-w-none">
            {response.split('\n').map((paragraph, i) => (
              <p key={i} className={i > 0 ? "mt-2" : ""}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
      
      {/* Results List */}
      <ul className="divide-y divide-gray-200">
        {results.map((result, index) => (
          <li 
            key={index} 
            className={`px-4 py-4 sm:px-6 ${expandedCase === result.caseId ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-center justify-between">
              <Link to={`/summary?caseId=${result.caseId}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Case {result.caseId}
              </Link>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Score: {(result.score * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className="mt-2 text-sm text-gray-600">
              {result.formattedSnippet ? 
                renderHtml(result.formattedSnippet) : 
                renderHtml(result.snippet)
              }
            </div>
            
            {result.metadataMatch && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                  {result.metadataMatch}
                </span>
              </div>
            )}
            
            <div className="mt-2 flex">
              <button 
                className="text-xs text-blue-600 hover:text-blue-800 mr-4"
                onClick={() => toggleExpand(result.caseId)}
              >
                {expandedCase === result.caseId ? 'Show Less' : 'Show More'}
              </button>
              <Link to={`/summary?caseId=${result.caseId}`} className="text-xs text-blue-600 hover:text-blue-800">
                Generate Summary
              </Link>
            </div>
            
            {/* Expanded case view */}
            {expandedCase === result.caseId && (
              <div className="mt-3 border-t pt-3 border-gray-200">
                <h5 className="text-xs font-medium text-gray-700 mb-1">Case Details</h5>
                <div className="bg-gray-100 p-3 rounded-md text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Country:</span> {result.metadata?.country_of_origin || 'Not specified'}
                    </div>
                    <div>
                      <span className="font-medium">Grounds:</span> {result.metadata?.grounds_for_persecution || 'Not specified'}
                    </div>
                    <div>
                      <span className="font-medium">Decision:</span> {result.metadata?.decision_outcome || 'Not specified'}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {result.metadata?.interview_date || 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      
      <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Export Results
          </button>
          <div className="flex-1 flex justify-center">
            <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                1
              </a>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                2
              </span>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                3
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>
          <span className="text-sm text-gray-500">
            Page 2 of 3
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
