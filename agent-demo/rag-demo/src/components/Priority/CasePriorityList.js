import React, { useState } from 'react';

const CasePriorityList = ({ prioritizedCases, priorityFunction }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [selectedCase, setSelectedCase] = useState(null);
  
  if (!prioritizedCases || prioritizedCases.length === 0 || !priorityFunction) {
    return null;
  }

  // Helper function to get badge color for priority score
  const getPriorityBadgeClass = (score) => {
    if (score >= 80) return "bg-red-100 text-red-800 border-red-300";
    if (score >= 65) return "bg-orange-100 text-orange-800 border-orange-300";
    if (score >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (score >= 35) return "bg-green-100 text-green-800 border-green-300";
    return "bg-blue-100 text-blue-800 border-blue-300";
  };

  const handleCaseSelect = (caseData) => {
    setSelectedCase(caseData);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedCase(null);
    setViewMode('list');
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Prioritized Cases
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Based on: {priorityFunction.description}
            </p>
          </div>
          
          {viewMode === 'detail' && (
            <button
              type="button"
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleBackToList}
            >
              <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to List
            </button>
          )}
        </div>
      </div>
      
      {viewMode === 'list' ? (
        <>
          {/* Priority Metrics Overview */}
          <div className="px-4 py-4 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700">Priority Metrics</h4>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
              {priorityFunction.priorityMetrics.map((metric) => (
                <div key={metric.name} className="border border-gray-200 rounded-md p-3 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">{metric.name}</span>
                    <span className="text-xs font-medium text-gray-900">
                      Weight: {(metric.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 line-clamp-2">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Cases List */}
          <div className="overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Case ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grounds
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prioritizedCases.map((caseData, index) => (
                  <tr key={caseData.case_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {caseData.case_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {caseData.country_of_origin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {caseData.grounds_for_persecution}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityBadgeClass(caseData.priorityScore)}`}>
                        {caseData.priorityScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleCaseSelect(caseData)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        // Detailed view of a selected case
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-base font-medium text-gray-900">Case Details</h4>
              <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Case ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedCase.case_id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Country of Origin</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedCase.country_of_origin}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Grounds for Persecution</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedCase.grounds_for_persecution}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Decision Outcome</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedCase.decision_outcome}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Interview Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedCase.interview_date}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Applicant Profile</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedCase.applicant_age}-year-old {selectedCase.applicant_gender}, 
                    {selectedCase.applicant_education}, 
                    {selectedCase.applicant_profession}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h4 className="text-base font-medium text-gray-900">Priority Score: {selectedCase.priorityScore}</h4>
              <div className="mt-3 bg-gray-50 rounded-md p-4 border border-gray-200">
                <h5 className="text-sm font-medium text-gray-700">Component Scores</h5>
                
                <div className="mt-3 space-y-3">
                  {Object.entries(selectedCase.componentScores).map(([key, score]) => (
                    <div key={key}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="text-sm text-gray-700">{score.toFixed(1)}/10</span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(score / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700">Explanation</h5>
                <p className="mt-2 text-sm text-gray-600">
                  {selectedCase.priorityExplanation}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Full Case
            </button>
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Expedite Processing
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {prioritizedCases.length} cases prioritized
          </div>
          <div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export Priority List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasePriorityList;
