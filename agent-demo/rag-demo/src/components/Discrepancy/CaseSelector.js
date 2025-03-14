import React, { useState } from 'react';
import { analyzeDiscrepancies } from '../../services/aiService';

const CaseSelector = ({ cases, transcripts, onAnalysisComplete }) => {
  const [selectedCase1, setSelectedCase1] = useState('');
  const [selectedCase2, setSelectedCase2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCaseChange = (e, caseNumber) => {
    const value = e.target.value;
    
    if (caseNumber === 1) {
      setSelectedCase1(value);
      
      // Reset case 2 if it's the same as case 1
      if (value === selectedCase2) {
        setSelectedCase2('');
      }
    } else {
      setSelectedCase2(value);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedCase1 || !selectedCase2) {
      setError('Please select two different cases to compare');
      return;
    }
    
    if (selectedCase1 === selectedCase2) {
      setError('Please select two different cases');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get case metadata
      const case1 = cases.find(c => c.case_id === selectedCase1);
      const case2 = cases.find(c => c.case_id === selectedCase2);
      
      if (!case1 || !case2) {
        throw new Error('Case metadata not found');
      }
      
      // Get transcripts
      const transcript1 = transcripts.find(t => t.case_id === selectedCase1)?.transcript || 
        "Sample transcript text for demonstration purposes.";
      
      const transcript2 = transcripts.find(t => t.case_id === selectedCase2)?.transcript || 
        "Sample transcript text for demonstration purposes.";
      
      // Analyze discrepancies
      const analysis = await analyzeDiscrepancies(transcript1, transcript2, case1, case2);
      
      // Pass the analysis to parent component
      onAnalysisComplete(analysis, case1, case2);
    } catch (err) {
      console.error('Error analyzing discrepancies:', err);
      setError('Failed to analyze discrepancies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Compare Interviews for Discrepancies
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            Select two different interview transcripts to analyze for inconsistencies and discrepancies.
          </p>
        </div>
        
        <div className="mt-5 space-y-5">
          <div>
            <label htmlFor="case-select-1" className="block text-sm font-medium text-gray-700">
              First Case
            </label>
            <select
              id="case-select-1"
              name="case-select-1"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedCase1}
              onChange={(e) => handleCaseChange(e, 1)}
            >
              <option value="">-- Select first case --</option>
              {cases.map(item => (
                <option 
                  key={item.case_id} 
                  value={item.case_id}
                  disabled={item.case_id === selectedCase2}
                >
                  {item.case_id} - {item.country_of_origin} ({item.grounds_for_persecution})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="case-select-2" className="block text-sm font-medium text-gray-700">
              Second Case
            </label>
            <select
              id="case-select-2"
              name="case-select-2"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedCase2}
              onChange={(e) => handleCaseChange(e, 2)}
              disabled={!selectedCase1}
            >
              <option value="">-- Select second case --</option>
              {cases.map(item => (
                <option 
                  key={item.case_id} 
                  value={item.case_id}
                  disabled={item.case_id === selectedCase1}
                >
                  {item.case_id} - {item.country_of_origin} ({item.grounds_for_persecution})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 text-sm text-red-600">
            {error}
          </div>
        )}
        
        <div className="mt-5">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleAnalyze}
            disabled={loading || !selectedCase1 || !selectedCase2}
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
                Analyzing...
              </>
            ) : (
              'Analyze Discrepancies'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseSelector;
