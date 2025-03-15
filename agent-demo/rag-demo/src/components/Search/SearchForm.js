import React, { useState } from 'react';

const SearchForm = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [advanced, setAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    countryOfOrigin: '',
    groundsForPersecution: '',
    decision: '',
    dateRange: 'all'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const toggleAdvanced = () => {
    setAdvanced(!advanced);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query || !query.trim()) {
      setError('Please enter a search query');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Pass the query string and filters to parent component
      onSearchResults(query.trim(), filters);
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="search-query" className="sr-only">
                Search Query
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className="h-5 w-5 text-gray-400" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search-query"
                  id="search-query"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search for political persecution, trafficking victims, fear of return..."
                  value={query}
                  onChange={handleQueryChange}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
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
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-3">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none"
              onClick={toggleAdvanced}
            >
              {advanced ? 'Hide advanced filters' : 'Show advanced filters'}
            </button>
          </div>
          
          {advanced && (
            <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="countryOfOrigin" className="block text-sm font-medium text-gray-700">
                  Country of Origin
                </label>
                <select
                  id="countryOfOrigin"
                  name="countryOfOrigin"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.countryOfOrigin}
                  onChange={handleFilterChange}
                >
                  <option value="">Any country</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Honduras">Honduras</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Haiti">Haiti</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Colombia">Colombia</option>
                  <option value="China">China</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Syria">Syria</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="groundsForPersecution" className="block text-sm font-medium text-gray-700">
                  Grounds for Persecution
                </label>
                <select
                  id="groundsForPersecution"
                  name="groundsForPersecution"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.groundsForPersecution}
                  onChange={handleFilterChange}
                >
                  <option value="">Any grounds</option>
                  <option value="Membership in a particular social group">Membership in a particular social group</option>
                  <option value="Political opinion">Political opinion</option>
                  <option value="Religion">Religion</option>
                  <option value="Nationality">Nationality</option>
                  <option value="Race">Race</option>
                  <option value="Gender-based violence">Gender-based violence</option>
                  <option value="LGBTQ+ identity">LGBTQ+ identity</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="decision" className="block text-sm font-medium text-gray-700">
                  Decision Outcome
                </label>
                <select
                  id="decision"
                  name="decision"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.decision}
                  onChange={handleFilterChange}
                >
                  <option value="">Any decision</option>
                  <option value="Granted">Granted</option>
                  <option value="Denied">Denied</option>
                  <option value="Referred to Immigration Court">Referred to Immigration Court</option>
                  <option value="Administrative Closure">Administrative Closure</option>
                  <option value="Withdrawn">Withdrawn</option>
                  <option value="Abandoned">Abandoned</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <select
                  id="dateRange"
                  name="dateRange"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                >
                  <option value="all">All time</option>
                  <option value="last_month">Last month</option>
                  <option value="last_3_months">Last 3 months</option>
                  <option value="last_6_months">Last 6 months</option>
                  <option value="last_year">Last year</option>
                </select>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
