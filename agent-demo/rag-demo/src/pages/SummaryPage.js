import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import SummaryGenerator from '../components/Summary/SummaryGenerator';
import SummaryDisplay from '../components/Summary/SummaryDisplay';
import { getTranscriptById } from '../services/firebase';

const SummaryPage = () => {
  const { casesMetadata, loading: metadataLoading } = useContext(AppContext);
  const [transcripts, setTranscripts] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [selectedCaseMetadata, setSelectedCaseMetadata] = useState(null);
  const [savedSummaries, setSavedSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch some transcripts for demo purposes
  useEffect(() => {
    const fetchSampleTranscripts = async () => {
      if (casesMetadata.length > 0) {
        setLoading(true);
        
        try {
          // For demo purposes, we'll fetch just a few transcripts
          const sampleSize = Math.min(5, casesMetadata.length);
          const sampleCases = casesMetadata.slice(0, sampleSize);
          
          const transcriptPromises = sampleCases.map(async (caseData) => {
            try {
              const transcript = await getTranscriptById(caseData.case_id);
              return {
                case_id: caseData.case_id,
                transcript: transcript?.content || "Sample transcript content for demo purposes."
              };
            } catch (err) {
              console.error(`Error fetching transcript for ${caseData.case_id}:`, err);
              return {
                case_id: caseData.case_id,
                transcript: "Error fetching transcript. Using placeholder for demo."
              };
            }
          });
          
          const fetchedTranscripts = await Promise.all(transcriptPromises);
          setTranscripts(fetchedTranscripts);
        } catch (err) {
          console.error("Error fetching transcripts:", err);
          setError("Failed to load transcripts. Using sample data for demonstration.");
          
          // Create sample transcripts for demo
          const sampleTranscripts = casesMetadata.slice(0, 5).map(caseData => ({
            case_id: caseData.case_id,
            transcript: `Sample transcript for case ${caseData.case_id}. This is placeholder text for the demo.`
          }));
          
          setTranscripts(sampleTranscripts);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchSampleTranscripts();
  }, [casesMetadata]);

  // Handle when a summary is generated
  const handleSummaryGenerated = (summary, caseMetadata) => {
    setSelectedSummary(summary);
    setSelectedCaseMetadata(caseMetadata);
    
    // Add to saved summaries if not already present
    if (!savedSummaries.some(s => s.caseId === caseMetadata.case_id)) {
      setSavedSummaries([
        ...savedSummaries,
        {
          caseId: caseMetadata.case_id,
          summary: summary,
          caseMetadata: caseMetadata,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  // Load a previously saved summary
  const handleLoadSavedSummary = (savedSummary) => {
    setSelectedSummary(savedSummary.summary);
    setSelectedCaseMetadata(savedSummary.caseMetadata);
  };

  return (
    <div>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Interview Summaries</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate concise summaries of asylum interview transcripts using AI
          </p>
        </div>
      </div>
      
      {metadataLoading || loading ? (
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
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <SummaryGenerator 
                transcripts={transcripts} 
                metadata={casesMetadata} 
                onSummaryGenerated={handleSummaryGenerated} 
              />
              
              {savedSummaries.length > 0 && (
                <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Saved Summaries
                    </h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="overflow-y-auto max-h-80">
                      <ul className="divide-y divide-gray-200">
                        {savedSummaries.map((saved) => (
                          <li key={saved.caseId} className="px-4 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleLoadSavedSummary(saved)}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Case {saved.caseId}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {saved.caseMetadata.country_of_origin}
                                </p>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                saved.caseMetadata.decision_outcome === "Granted" 
                                  ? "decision-granted" 
                                  : saved.caseMetadata.decision_outcome === "Denied" 
                                    ? "decision-denied" 
                                    : "decision-referred"
                              }`}>
                                {saved.caseMetadata.decision_outcome}
                              </span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                              {new Date(saved.timestamp).toLocaleString()}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2">
              {selectedSummary ? (
                <SummaryDisplay 
                  summary={selectedSummary} 
                  caseMetadata={selectedCaseMetadata} 
                />
              ) : (
                <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No summary generated</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a case and generate a summary to view it here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryPage;
