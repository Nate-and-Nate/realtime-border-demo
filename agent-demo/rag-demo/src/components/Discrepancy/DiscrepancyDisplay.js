import React from 'react';

const DiscrepancyDisplay = ({ analysis, case1, case2 }) => {
  if (!analysis) return null;

  // Helper function to get severity badge color
  const getSeverityClass = (severity) => {
    const severityMap = {
      "High": "bg-red-100 text-red-800 border-red-300",
      "Medium": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Low": "bg-green-100 text-green-800 border-green-300"
    };
    
    return severityMap[severity] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Discrepancy Analysis
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Comparing Case {case1.case_id} and Case {case2.case_id}
            </p>
          </div>
          
          <div className="mt-3 sm:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSeverityClass(analysis.severity)}`}>
              {analysis.severity} Severity
            </span>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Case 1</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {case1.case_id} ({case1.country_of_origin})
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Case 2</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {case2.case_id} ({case2.country_of_origin})
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Discrepancy Count</dt>
            <dd className="mt-1 text-sm text-gray-900">{analysis.discrepancyCount}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Analysis Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{new Date().toLocaleDateString()}</dd>
          </div>
        </dl>
        
        <div className="mt-6">
          <h4 className="text-base font-medium text-gray-900">Key Discrepancies</h4>
          <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topic
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Case {case1.case_id}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Case {case2.case_id}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Significance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analysis.keyDiscrepancies.map((discrepancy, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {discrepancy.topic}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {discrepancy.statement1}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {discrepancy.statement2}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        discrepancy.significance === "High" 
                          ? "bg-red-100 text-red-800 border-red-300"
                          : discrepancy.significance === "Medium"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : "bg-green-100 text-green-800 border-green-300"
                      }`}>
                        {discrepancy.significance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <h4 className="text-base font-medium text-gray-900">Explanation and Context</h4>
            <div className="mt-2 space-y-4">
              {analysis.keyDiscrepancies.map((discrepancy, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <h5 className="text-sm font-medium text-gray-900">{discrepancy.topic}</h5>
                  <p className="mt-1 text-sm text-gray-600">{discrepancy.explanation}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-base font-medium text-gray-900">Consistencies</h4>
            <ul className="mt-2 ml-5 space-y-1 list-disc text-sm text-gray-600">
              {analysis.consistencies.map((consistency, index) => (
                <li key={index}>{consistency}</li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 p-4 border border-blue-200 rounded-md bg-blue-50">
            <h4 className="text-base font-medium text-blue-800">Recommendation</h4>
            <p className="mt-1 text-sm text-blue-700">{analysis.recommendation}</p>
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
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-5 7a1 1 0 100-2 1 1 0 000 2zm1 2a1 1 0 112 0 1 1 0 01-2 0zm3-2a1 1 0 100-2 1 1 0 000 2zm1 2a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
            </svg>
            Export Report
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscrepancyDisplay;
