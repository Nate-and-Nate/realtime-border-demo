import React from 'react';

const SummaryDisplay = ({ summary, caseMetadata }) => {
  if (!summary) return null;

  // Helper function to get decision badge color
  const getDecisionClass = (decision) => {
    const decisionMap = {
      "Granted": "decision-granted",
      "Denied": "decision-denied",
      "Referred to Immigration Court": "decision-referred",
      "Administrative Closure": "decision-administrative",
      "Withdrawn": "decision-withdrawn",
      "Abandoned": "decision-abandoned"
    };
    
    return decisionMap[decision] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Summary for Case {caseMetadata.case_id}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {caseMetadata.applicant_age}-year-old {caseMetadata.applicant_gender} from {caseMetadata.country_of_origin}
            </p>
          </div>
          
          <div className="mt-2 sm:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDecisionClass(caseMetadata.decision_outcome)}`}>
              {caseMetadata.decision_outcome}
            </span>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Interview Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{caseMetadata.interview_date}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Decision Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{caseMetadata.decision_date}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Asylum Officer</dt>
            <dd className="mt-1 text-sm text-gray-900">{caseMetadata.asylum_officer_id}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Grounds for Persecution</dt>
            <dd className="mt-1 text-sm text-gray-900">{caseMetadata.grounds_for_persecution}</dd>
          </div>
        </dl>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500">Summary</h4>
          <div className="mt-2 p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="text-sm text-gray-900 whitespace-pre-line">
              {summary.summary}
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Generated using {summary.model}</span>
            <span>{new Date(summary.timestamp).toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>{summary.promptTokens} prompt tokens</span>
            <span>{summary.completionTokens} completion tokens</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-5 7a1 1 0 100-2 1 1 0 000 2zm1 2a1 1 0 112 0 1 1 0 01-2 0zm3-2a1 1 0 100-2 1 1 0 000 2zm1 2a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
            </svg>
            Print
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;
