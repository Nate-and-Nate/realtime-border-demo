import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import SearchForm from '../components/Search/SearchForm';
import SearchResults from '../components/Search/SearchResults';
import { semanticSearch } from '../services/aiService';

const SearchPage = () => {
  const { loading: metadataLoading } = useContext(AppContext);
  const [searchData, setSearchData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({});
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Get recent searches from local storage on mount
  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      try {
        setRecentSearches(JSON.parse(storedSearches));
      } catch (e) {
        console.error('Error parsing stored searches:', e);
      }
    }
  }, []);

  // Store recent searches in local storage when updated
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  // Handle search results from the search form
  const handleSearch = async (query, filters) => {
    // Validate that query is a string 
    if (!query || typeof query !== 'string') {
      setError('Invalid search query');
      return;
    }
    
    const queryText = query.trim();
    if (queryText === '') {
      setError('Please enter a search query');
      return;
    }
    
    try {
      setIsSearching(true);
      setError(null);
      setSearchQuery(queryText);
      setSearchFilters(filters);
      
      // Call the semanticSearch function (which now uses RAG)
      const results = await semanticSearch(queryText, filters);
      setSearchData(results);
      
      // Add to recent searches
      const newSearch = {
        query: queryText,
        filters,
        timestamp: new Date().toISOString(),
        resultCount: results.resultCount || 0
      };
      
      setRecentSearches(prev => {
        const newSearches = [newSearch, ...prev.filter(s => s.query !== queryText)];
        // Keep only 5 most recent searches
        return newSearches.slice(0, 5);
      });
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle clicking on a recent search
  const handleRecentSearchClick = (search) => {
    handleSearch(search.query, search.filters);
  };

  return (
    <div>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Semantic Search</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search across interview transcripts using natural language and AI
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
                      <li 
                        key={index} 
                        className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRecentSearchClick(search)}
                      >
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
                        {Object.entries(search.filters || {}).some(([key, value]) => value) && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {Object.entries(search.filters).map(([key, value]) => 
                              value ? (
                                <span key={key} className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                  {value.length > 15 ? value.substring(0, 15) + '...' : value}
                                </span>
                              ) : null
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    About RAG Search
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-sm text-gray-600 space-y-4">
                    <p>
                      This search uses Retrieval-Augmented Generation (RAG) to find relevant information across all asylum interviews.
                    </p>
                    <p>
                      RAG combines the power of:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-medium">Vector Similarity Search</span> - Finding semantically similar content, not just keyword matches
                      </li>
                      <li>
                        <span className="font-medium">Large Language Models</span> - Generating helpful, contextual responses based on retrieved content
                      </li>
                    </ul>
                    <p>
                      Try using natural language questions, such as "Cases where applicants feared gang violence in El Salvador" or "Examples of religious persecution of Christians."
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              <SearchForm onSearchResults={handleSearch} />
              
              {error && (
                <div className="bg-red-50 rounded-lg border border-red-200 p-4 text-red-700">
                  {error}
                </div>
              )}
              
              {isSearching ? (
                <div className="bg-white shadow rounded-lg overflow-hidden p-8 text-center">
                  <svg 
                    className="spinner mx-auto h-12 w-12 text-blue-500" 
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
                  <p className="mt-4 text-gray-500">Searching and generating response...</p>
                </div>
              ) : searchData ? (
                <SearchResults 
                  searchData={searchData}
                  query={searchQuery} 
                  filters={searchFilters} 
                />
              ) : (
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
                        onClick={() => handleSearch("Cases involving political persecution in Venezuela", {})}
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
