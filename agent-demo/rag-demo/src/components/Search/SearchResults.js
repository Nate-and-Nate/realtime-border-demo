import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ results, query, filters }) => {
  if (!results || results.length === 0) {
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

  // Helper function to highlight search terms in snippets
  const highlightText = (text, highlights) => {
    if (!highlights || highlights.length === 0) return text;
    
    let highlightedText = text;
    highlights.forEach(term => {
      // Case-insensitive highlight
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
    });
    
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Search Results
          </h3>
          <span className="text-sm text-gray-500">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
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
      
      <ul className="divide-y divide-gray-200">
        {results.map((result, index) => (
          <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <Link to={`/summary?caseId=${result.caseId}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Case {result.caseId}
              </Link>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Score: {(result.score * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className="mt-2 text-sm text-gray-600">
              {highlightText(result.snippet, result.highlights)}
            </div>
            
            {result.metadataMatch && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                  {result.metadataMatch}
                </span>
              </div>
            )}
            
            <div className="mt-2 flex">
              <button className="text-xs text-blue-600 hover:text-blue-800 mr-4">
                View Full Transcript
              </button>
              <button className="text-xs text-blue-600 hover:text-blue-800">
                Generate Summary
              </button>
            </div>
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
