import React, { useState } from 'react';

const BackgroundResults = ({ results, caseData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!results || !caseData) return null;

  // Helper function to get status badge color
  const getStatusBadgeClass = (status, context) => {
    if (context === 'criminal') {
      return status === 'None' 
        ? "bg-green-100 text-green-800 border-green-300" 
        : "bg-red-100 text-red-800 border-red-300";
    }
    
    if (context === 'identity') {
      return status === 'Verified' 
        ? "bg-green-100 text-green-800 border-green-300" 
        : status === 'Partial' 
          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
          : "bg-red-100 text-red-800 border-red-300";
    }
    
    if (context === 'watchlist') {
      return status === 'Clear' 
        ? "bg-green-100 text-green-800 border-green-300" 
        : status === 'Info' 
          ? "bg-blue-100 text-blue-800 border-blue-300"
          : "bg-red-100 text-red-800 border-red-300";
    }
    
    if (context === 'travel') {
      return status === 'Verified' 
        ? "bg-green-100 text-green-800 border-green-300" 
        : status === 'Partial' 
          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
          : "bg-gray-100 text-gray-800 border-gray-300";
    }
    
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  // Get risk level class
  const getRiskClass = (score) => {
    if (score < 2) return "bg-green-100 text-green-800 border-green-300";
    if (score < 5) return "bg-green-100 text-green-800 border-green-300";
    if (score < 10) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (score < 20) return "bg-orange-100 text-orange-800 border-orange-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Background Check Results
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Case {caseData.case_id} - {caseData.applicant_gender}, {caseData.applicant_age} from {caseData.country_of_origin}
            </p>
          </div>
          
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-500 mr-2">Risk Score:</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskClass(results.riskScore)}`}>
              {results.riskScore}
            </span>
          </div>
        </div>
        
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`${
                activeTab === 'criminal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('criminal')}
            >
              Criminal Record
            </button>
            <button
              className={`${
                activeTab === 'identity'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('identity')}
            >
              Identity
            </button>
            <button
              className={`${
                activeTab === 'travel'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('travel')}
            >
              Travel History
            </button>
          </nav>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Criminal Record</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(results.criminalRecord.status, 'criminal')}`}>
                    {results.criminalRecord.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {results.criminalRecord.status === 'None' 
                    ? 'No criminal records found'
                    : `${results.criminalRecord.offenseCount} offense(s) found`
                  }
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Identity Verification</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(results.identityVerification.status, 'identity')}`}>
                    {results.identityVerification.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {results.identityVerification.status === 'Verified'
                    ? 'Identity successfully verified'
                    : results.identityVerification.reason
                  }
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Watchlist Check</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(results.watchlistCheck.status, 'watchlist')}`}>
                    {results.watchlistCheck.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {results.watchlistCheck.status === 'Clear'
                    ? 'No watchlist matches found'
                    : results.watchlistCheck.reason
                  }
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full ${
                      results.recommendations.furtherInvestigationRequired ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'
                    } mr-2`}>
                      {results.recommendations.furtherInvestigationRequired ? '!' : '✓'}
                    </span>
                    <span className="text-sm text-gray-700">
                      Further investigation is {results.recommendations.furtherInvestigationRequired ? '' : 'not '}required
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full ${
                      results.recommendations.inPersonInterviewRecommended ? 'bg-yellow-100 text-yellow-500' : 'bg-green-100 text-green-500'
                    } mr-2`}>
                      {results.recommendations.inPersonInterviewRecommended ? '!' : '✓'}
                    </span>
                    <span className="text-sm text-gray-700">
                      In-person interview is {results.recommendations.inPersonInterviewRecommended ? '' : 'not '}recommended
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full ${
                      results.recommendations.expeditedProcessingEligible ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-500'
                    } mr-2`}>
                      {results.recommendations.expeditedProcessingEligible ? '✓' : '×'}
                    </span>
                    <span className="text-sm text-gray-700">
                      Applicant is {results.recommendations.expeditedProcessingEligible ? '' : 'not '}eligible for expedited processing
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Check Date: {results.checkDate}</span>
                <span className="text-xs text-gray-500">Case ID: {results.caseId}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Criminal Record Tab */}
        {activeTab === 'criminal' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-medium text-gray-900">Criminal Record Check</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(results.criminalRecord.status, 'criminal')}`}>
                {results.criminalRecord.status}
              </span>
            </div>
            
            {results.criminalRecord.status === 'None' ? (
              <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-6">
                <div className="flex">
                  <svg className="h-5 w-5 text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-green-700">
                    No criminal records found for this applicant.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-4">
                  <div className="flex">
                    <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-700">
                      Found {results.criminalRecord.offenseCount} criminal {results.criminalRecord.offenseCount === 1 ? 'offense' : 'offenses'} for this applicant.
                    </p>
                  </div>
                </div>
                
                <h5 className="text-sm font-medium text-gray-700 mb-2">Offense Record(s)</h5>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.criminalRecord.offenses.map((offense, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              offense.type.includes('violent') 
                                ? offense.type.includes('Major')
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-orange-100 text-orange-800'
                                : offense.type.includes('Major')
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}>
                              {offense.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {offense.date}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {offense.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">How This Check Works</h5>
              <p className="text-sm text-gray-600">
                The criminal record check queries multiple international and local databases to identify any past criminal history. 
                The accuracy of this check depends on the quality and availability of records in the applicant's country of origin.
                For this demo, the check uses realistic probability distributions based on country, age, education, and other factors.
              </p>
            </div>
          </div>
        )}
        
        {/* Identity Tab */}
        {activeTab === 'identity' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-medium text-gray-900">Identity Verification</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(results.identityVerification.status, 'identity')}`}>
                {results.identityVerification.status}
              </span>
            </div>
            
            <div className={`p-4 rounded-md border mb-6 ${
              results.identityVerification.status === 'Verified'
                ? 'bg-green-50 border-green-200'
                : results.identityVerification.status === 'Partial'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex">
                {results.identityVerification.status === 'Verified' ? (
                  <svg className="h-5 w-5 text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : results.identityVerification.status === 'Partial' ? (
                  <svg className="h-5 w-5 text-yellow-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <p className={`text-sm ${
                  results.identityVerification.status === 'Verified'
                    ? 'text-green-700'
                    : results.identityVerification.status === 'Partial'
                      ? 'text-yellow-700'
                      : 'text-red-700'
                }`}>
                  {results.identityVerification.status === 'Verified'
                    ? 'Identity successfully verified with provided documentation.'
                    : results.identityVerification.reason
                  }
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Verification Factors</h5>
              <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                <li className="flex justify-between items-center p-3">
                  <span className="text-sm text-gray-600">Name Verification</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    results.identityVerification.status === 'Verified' || results.identityVerification.status === 'Partial'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {results.identityVerification.status === 'Verified' || results.identityVerification.status === 'Partial'
                      ? 'Verified'
                      : 'Failed'
                    }
                  </span>
                </li>
                <li className="flex justify-between items-center p-3">
                  <span className="text-sm text-gray-600">Date of Birth Verification</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    results.identityVerification.status === 'Verified' || results.identityVerification.status === 'Partial'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {results.identityVerification.status === 'Verified'
                      ? 'Verified'
                      : results.identityVerification.status === 'Partial'
                        ? 'Partial'
                        : 'Inconsistent'
                    }
                  </span>
                </li>
                <li className="flex justify-between items-center p-3">
                  <span className="text-sm text-gray-600">Document Authenticity</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    results.identityVerification.status === 'Verified'
                      ? 'bg-green-100 text-green-800'
                      : results.identityVerification.status === 'Partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {results.identityVerification.status === 'Verified'
                      ? 'Verified'
                      : results.identityVerification.status === 'Partial'
                        ? 'Partial'
                        : 'Failed'
                    }
                  </span>
                </li>
                <li className="flex justify-between items-center p-3">
                  <span className="text-sm text-gray-600">Biometric Match</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    results.identityVerification.status === 'Verified'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {results.identityVerification.status === 'Verified'
                      ? 'Verified'
                      : 'Not Performed'
                    }
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">How This Check Works</h5>
              <p className="text-sm text-gray-600">
                Identity verification checks the authenticity of provided documents and personal information.
                This includes verification of identification documents, checking for consistency with supplied 
                information, and when available, biometric matching.
                For this demo, verification status is generated with realistic probabilities based on country of origin
                and other applicant factors.
              </p>
            </div>
          </div>
        )}
        
        {/* Travel History Tab */}
        {activeTab === 'travel' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-medium text-gray-900">Travel History</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(results.travelHistory.status, 'travel')}`}>
                {results.travelHistory.status}
              </span>
            </div>
            
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Travel Route</h5>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="space-y-4">
                  {results.travelHistory.countries.map((country, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && (
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-px h-8 bg-gray-300"></div>
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <div className={`flex-grow flex items-center p-3 rounded-md ${
                        index === 0 ? 'bg-blue-50 border border-blue-200' :
                        index === results.travelHistory.countries.length - 1 ? 'bg-green-50 border border-green-200' :
                        'bg-white border border-gray-200'
                      }`}>
                        <div className="flex-grow">
                          <p className="text-sm font-medium text-gray-900">{country.name}</p>
                          {index > 0 && country.entryDate && (
                            <p className="text-xs text-gray-500">Entry: {country.entryDate}</p>
                          )}
                          {index < results.travelHistory.countries.length - 1 && country.exitDate && (
                            <p className="text-xs text-gray-500">Exit: {country.exitDate}</p>
                          )}
                        </div>
                        {index === 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Origin
                          </span>
                        )}
                        {index === results.travelHistory.countries.length - 1 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Travel verification status: {results.travelHistory.status}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">How This Check Works</h5>
              <p className="text-sm text-gray-600">
                The travel history check attempts to verify the applicant's reported travel route and timeline.
                This includes entry and exit records from various countries, visa records, and other travel documentation.
                For this demo, travel history is generated based on known typical routes from the country of origin,
                with realistic probabilities for verification status.
              </p>
            </div>
          </div>
        )}
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
            Print Report
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share Results
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add to Case File
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundResults;
