import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext } from 'react';

// Import layout components
import Layout from './components/Layout/Layout.js';

// Import pages
import HomePage from './pages/HomePage.js';
import SummaryPage from './pages/SummaryPage';
import SearchPage from './pages/SearchPage';
import DiscrepancyPage from './pages/DiscrepancyPage';
import PriorityPage from './pages/PriorityPage';
import BackgroundPage from './pages/BackgroundPage';

// Import services
import { getRecentCases } from './services/firebase';

// Create context for global state
export const AppContext = createContext();

function App() {
  // Global state
  const [casesMetadata, setCasesMetadata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const recentCases = await getRecentCases(20); // Get 20 most recent cases
        setCasesMetadata(recentCases);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load initial data. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <AppContext.Provider value={{ casesMetadata, loading, error }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/discrepancy" element={<DiscrepancyPage />} />
            <Route path="/priority" element={<PriorityPage />} />
            <Route path="/background" element={<BackgroundPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
