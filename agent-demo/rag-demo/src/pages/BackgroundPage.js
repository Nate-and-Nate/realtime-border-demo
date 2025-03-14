import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import BackgroundCheckForm from '../components/Background/BackgroundCheckForm';
import BackgroundResults from '../components/Background/BackgroundResults';

const BackgroundPage = () => {
  const { casesMetadata, loading: metadataLoading } = useContext(AppContext);
  const [results, setResults] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [checkHistory, setCheckHistory] = useState([]);

  // Handle when background check is complete
  const handleCheckComplete = (checkResults, caseData) => {
    setResults(checkResults);
    setSelectedCase(caseData);
    
    // Add to check history
    setCheckHistory(prev => {
      const newHistory = [
        {
          caseId: caseData.case_id,
          applicant: `${caseData.applicant_age}-year-old ${caseData.applicant_gender} from ${caseData.country_of_origin}`,
          checkDate: checkResults.checkDate,
          riskScore: checkResults.riskScore,
          criminalStatus: checkResults.criminalRecord.status,
          identityStatus: checkResults.identityVerification.status
        },
        ...prev
      ];
      // Keep only 5 most recent checks
      return newHistory.slice(0, 5);
    });
  };

  return (
    <div>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Background Checks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Simulate background checks with realistic probability distributions
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <BackgroundCheckForm 
                cases={casesMetadata} 
                onCheckComplete={handleCheckComplete} 
              />
              
              {checkHistory.length > 0 && (
                <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Recent Checks
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {checkHistory.map((check, index) => (
                      <li key={index} className="px-4 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Case {check.caseId}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {check.applicant}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            check.riskScore < 5 
                              ? "bg-green-100 text-green-800" 
                              : check.riskScore < 15 
                                ? "bg-yellow-100 text-yellow-800" 
                                : "bg-red-100 text-red-800"
                          }`}>
                            Risk: {check.riskScore}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex space-x-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              check.criminalStatus === 'None' 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {check.criminalStatus === 'None' ? "No Criminal" : "Criminal Record"}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              check.identityStatus === 'Verified' 
                                ? "bg-green-100 text-green-800" 
                                : check.identityStatus === 'Partial'
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}>
                              ID: {check.identityStatus}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {check.checkDate}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    About Background Checks
                  </h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p className="mb-3">
                      This feature simulates background checks on asylum applicants with realistic probability distributions.
                    </p>
                    <p className="mb-3">
                      The mock API includes:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Criminal background check with variable offense types and severity</li>
                      <li>Identity verification with multiple verification methods</li>
                      <li>Travel history verification and route visualization</li>
                      <li>Watchlist screening with multiple risk levels</li>
                      <li>Realistic probability distributions based on country, age, education, etc.</li>
                    </ul>
                    <p className="mt-3">
                      In a real application, this would connect to various law enforcement databases, 
                      identity verification services, and international screening systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              {results && selectedCase ? (
                <BackgroundResults 
                  results={results} 
                  caseData={selectedCase} 
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No background check performed</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a case and perform a background check to view results here.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {
                        // Perform a demo check on the first case
                        if (casesMetadata.length > 0) {
                          const demoCase = casesMetadata[0];
                          handleCheckComplete({
                            caseId: demoCase.case_id,
                            checkDate: new Date().toISOString().split('T')[0],
                            riskScore: 4.2,
                            criminalRecord: {
                              status: "None",
                              offenseCount: 0,
                              offenses: []
                            },
                            identityVerification: {
                              status: "Verified",
                              reason: null
                            },
                            travelHistory: {
                              status: "Verified",
                              countries: [
                                {
                                  name: demoCase.country_of_origin,
                                  entryDate: null,
                                  exitDate: "2022-08-15"
                                },
                                {
                                  name: "Mexico",
                                  entryDate: "2022-08-16",
                                  exitDate: "2022-09-01"
                                },
                                {
                                  name: "United States",
                                  entryDate: "2022-09-02",
                                  exitDate: null
                                }
                              ]
                            },
                            watchlistCheck: {
                              status: "Clear",
                              level: null,
                              reason: null
                            },
                            recommendations: {
                              furtherInvestigationRequired: false,
                              inPersonInterviewRecommended: false,
                              expeditedProcessingEligible: true
                            }
                          }, demoCase);
                        }
                      }}
                    >
                      Run Example Check
                    </button>
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

export default BackgroundPage;
