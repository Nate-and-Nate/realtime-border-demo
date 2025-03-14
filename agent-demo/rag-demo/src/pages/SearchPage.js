import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import SearchForm from '../components/Search/SearchForm';
import SearchResults from '../components/Search/SearchResults';

const SearchPage = () => {
  const { loading: metadataLoading } = useContext(AppContext);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({});
  const [recentSearches, setRecentSearches] = useState([]);

  // Handle search results from the search form
  const handleSearchResults = (results, query, filters) => {
    setSearchResults(results);
    setSearchQuery(query);
    setSearchFilters(filters);
    
    // Add to recent searches
    const newSearch = {
      query,
      filters,
      timestamp: new Date().toISOString(),
      resultCount: results.length
    };
    
    setRecentSearches(prev => {
      const newSearches = [newSearch, ...prev];
      // Keep only 5 most recent searches
      return newSearches.slice(0, 5);
    });
  };

  return (
    <div>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Semantic Search</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search across interview transcripts and summaries using natural language
          </p>
        </div>
      </div>
      
      {metadataLoading ? (
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
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              {recentSearches.length > 0 && (
                <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Recent Searches
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {recentSearches.map((search, index) => (
                      <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                        <div className="text-sm font-medium text-gray-900">
                          {search.query}
                        </div>
                        <div className="mt-1 flex justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(search.timestamp).toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {search.resultCount} results
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Search Tips
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2">
                        Use natural language to describe what you're looking for
                      </span>
                    </li>
                    <li className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2">
                        Enter specific details like "political persecution" or "family threats"
                      </span>
                    </li>
                    <li className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2">
                        Add advanced filters to narrow down your search results
                      </span>
                    </li>
                    <li className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2">
                        Search looks across both interview transcripts and AI-generated summaries
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              <SearchForm onSearchResults={handleSearchResults} />
              
              {searchResults && (
                <SearchResults 
                  results={searchResults} 
                  query={searchQuery} 
                  filters={searchFilters} 
                />
              )}
              
              {!searchResults && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:p-6 text-center">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No search performed</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Use the search form above to find relevant asylum cases.
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => {
                          // Example search query
                          handleSearchResults([
                            {
                              caseId: "A123456",
                              score: 0.92,
                              snippet: "The applicant described fleeing due to political persecution after participating in protests against the government.",
                              metadataMatch: "Political opinion persecution",
                              highlights: ["political persecution", "protests", "government"]
                            },
                            {
                              caseId: "A789012",
                              score: 0.87,
                              snippet: "The asylum seeker testified about government officials threatening them after they spoke at opposition rallies.",
                              metadataMatch: "Political opinion persecution",
                              highlights: ["government officials", "threatening", "opposition rallies"]
                            },
                          ], "political persecution", {})
                        }}
                      >
                        Try Example Search
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
