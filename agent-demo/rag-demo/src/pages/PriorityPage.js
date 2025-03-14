import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import MetricCreator from '../components/Priority/MetricCreator';
import CasePriorityList from '../components/Priority/CasePriorityList';

const PriorityPage = () => {
  const { casesMetadata, loading: metadataLoading } = useContext(AppContext);
  const [prioritizedCases, setPrioritizedCases] = useState(null);
  const [priorityFunction, setPriorityFunction] = useState(null);
  const [savedMetrics, setSavedMetrics] = useState([]);

  // Handle when priority function is applied to cases
  const handlePriorityApplied = (rankedCases, functionObj) => {
    setPrioritizedCases(rankedCases);
    setPriorityFunction(functionObj);
    
    // Add to saved metrics if not already present
    if (!savedMetrics.some(m => m.description === functionObj.description)) {
      setSavedMetrics([
        ...savedMetrics,
        {
          id: functionObj.functionId,
          description: functionObj.description,
          createdAt: functionObj.createdAt,
          metrics: functionObj.priorityMetrics
        }
      ]);
    }
  };

  // Handle loading a saved metric
  const handleLoadSavedMetric = (metric) => {
    // For demo purposes, we'll just re-use the current priority function
    // but with the saved description and metrics
    if (priorityFunction) {
      const loadedFunction = {
        ...priorityFunction,
        functionId: metric.id,
        description: metric.description,
        priorityMetrics: metric.metrics,
        createdAt: metric.createdAt
      };
      
      // Re-apply this function to cases
      // In a real app, you would retrieve the actual function logic from backend
      handlePriorityApplied(prioritizedCases, loadedFunction);
    }
  };

  return (
    <div>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Priority Metrics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create custom qualitative prioritization metrics using natural language
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
              <MetricCreator 
                cases={casesMetadata} 
                onPriorityApplied={handlePriorityApplied} 
              />
              
              {savedMetrics.length > 0 && (
                <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Saved Metrics
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {savedMetrics.map((metric) => (
                      <li key={metric.id} className="px-4 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleLoadSavedMetric(metric)}>
                        <div className="text-sm font-medium text-gray-900">
                          {metric.description}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {metric.metrics.map((m) => (
                            <span key={m.name} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                              {m.name}: {(m.weight * 100).toFixed(0)}%
                            </span>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Created: {new Date(metric.createdAt).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    About Priority Metrics
                  </h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p className="mb-3">
                      This feature allows you to create custom prioritization metrics for asylum cases using natural language descriptions.
                    </p>
                    <p className="mb-3">
                      The AI will:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Parse your description</li>
                      <li>Extract key prioritization criteria</li>
                      <li>Create a scoring function</li>
                      <li>Apply it to all cases</li>
                    </ul>
                    <p className="mt-3">
                      This enables more qualitative, nuanced prioritization than traditional rigid metrics, making it easier to adapt to changing priorities and policies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              {prioritizedCases && priorityFunction ? (
                <CasePriorityList 
                  prioritizedCases={prioritizedCases} 
                  priorityFunction={priorityFunction} 
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
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" 
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No priority metrics created</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create a priority metric using natural language to see cases ranked here.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {
                        // Create a demo priority function
                        const demoFunction = {
                          functionId: `priority_${Date.now()}`,
                          description: "Prioritize applicants with STEM backgrounds, larger family sizes, and from countries with active conflicts",
                          createdAt: new Date().toISOString(),
                          model: "gpt-4",
                          functionDescription: "This priority function analyzes case metadata to prioritize cases based on STEM backgrounds, family size, and country conditions.",
                          priorityMetrics: [
                            {
                              name: "STEM Background",
                              weight: 0.4,
                              description: "Prioritizes applicants with STEM backgrounds"
                            },
                            {
                              name: "Family Size",
                              weight: 0.3,
                              description: "Considers family size as a factor"
                            },
                            {
                              name: "Country Conditions",
                              weight: 0.2,
                              description: "Prioritizes applicants from high-risk countries"
                            },
                            {
                              name: "Case Duration",
                              weight: 0.1,
                              description: "Considers time since interview"
                            }
                          ]
                        };
                        
                        // Apply to cases (simplified for demo)
                        handlePriorityApplied(
                          casesMetadata
                            .slice(0, 20)
                            .map(c => ({
                              ...c,
                              priorityScore: Math.floor(Math.random() * 60) + 20,
                              componentScores: {
                                stemBackground: Math.floor(Math.random() * 10),
                                vulnerability: Math.floor(Math.random() * 10),
                                familySize: Math.floor(Math.random() * 10),
                                timeFactor: Math.floor(Math.random() * 10)
                              },
                              priorityExplanation: `This case received a priority score based on ${c.has_stem_background ? "STEM background" : "non-STEM background"}, family size of ${c.family_size}, and country of origin (${c.country_of_origin}).`
                            }))
                            .sort((a, b) => b.priorityScore - a.priorityScore),
                          demoFunction
                        );
                      }}
                    >
                      Try Example Metric
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

export default PriorityPage;
