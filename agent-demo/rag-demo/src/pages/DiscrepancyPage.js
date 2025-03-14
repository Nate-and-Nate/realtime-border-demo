import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import CaseSelector from '../components/Discrepancy/CaseSelector';
import DiscrepancyDisplay from '../components/Discrepancy/DiscrepancyDisplay';
import { getTranscriptById } from '../services/firebase';

const DiscrepancyPage = () => {
  const { casesMetadata, loading: metadataLoading } = useContext(AppContext);
  const [transcripts, setTranscripts] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [case1, setCase1] = useState(null);
  const [case2, setCase2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch some transcripts for demo purposes
  useEffect(() => {
    const fetchSampleTranscripts = async () => {
      if (casesMetadata.length > 0) {
        setLoading(true);
        
        try {
          // For demo purposes, we'll fetch just a few transcripts
          const sampleSize = Math.min(10, casesMetadata.length);
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
          const sampleTranscripts = casesMetadata.slice(0, 10).map(caseData => ({
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

  // Handle when discrepancy analysis is complete
  const handleAnalysisComplete = (analysisResult, caseData1, caseData2) => {
    setAnalysis(analysisResult);
    setCase1(caseData1);
    setCase2(caseData2);
  };

  return (
    <div>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Discrepancy Analysis</h1>
          <p className="mt-1 text-sm text-gray-500">
            Compare interviews to identify inconsistencies and potential credibility issues
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
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <CaseSelector 
                cases={casesMetadata} 
                transcripts={transcripts} 
                onAnalysisComplete={handleAnalysisComplete} 
              />
              
              <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    About Discrepancy Analysis
                  </h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p className="mb-3">
                      This feature uses AI to compare two different interview transcripts and identify potential inconsistencies or discrepancies that may affect credibility assessments.
                    </p>
                    <p className="mb-3">
                      The analysis examines:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Key dates and timelines</li>
                      <li>Names of people and locations</li>
                      <li>Description of events</li>
                      <li>Details about persecution</li>
                      <li>Travel routes and documentation</li>
                    </ul>
                    <p className="mt-3">
                      Each discrepancy is rated for significance based on its potential impact on the overall case credibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              {analysis && case1 && case2 ? (
                <DiscrepancyDisplay 
                  analysis={analysis} 
                  case1={case1} 
                  case2={case2} 
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
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No analysis performed</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select two cases and analyze discrepancies to view results here.
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

export default DiscrepancyPage;
