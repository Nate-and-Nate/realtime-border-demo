import React, { useState } from 'react';
import { createPriorityFunction, applyPriorityFunction } from '../../services/aiService';

const MetricCreator = ({ cases, onPriorityApplied }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showExamples, setShowExamples] = useState(false);

  // Example priority descriptions
  const examples = [
    "Prioritize cases with applicants who have STEM backgrounds, larger family sizes, and are from countries with active conflicts",
    "Give higher priority to vulnerable populations like women with children, especially from countries with gender-based persecution",
    "Prioritize healthcare workers and medical professionals who could help with the healthcare worker shortage",
    "Find cases from applicants with education backgrounds that could help with teacher shortages in rural areas",
    "Prioritize cases with clear documentation and higher chances of approval to increase efficiency"
  ];

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUseExample = (example) => {
    setDescription(example);
    setShowExamples(false);
  };

  const handleCreateMetric = async (e) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('Please enter a description for your priority metric');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create priority function from description
      const priorityFunction = await createPriorityFunction(description);
      
      // Apply the priority function to the cases
      const prioritizedCases = await applyPriorityFunction(cases, priorityFunction);
      
      // Pass the results to parent component
      onPriorityApplied(prioritizedCases, priorityFunction);
    } catch (err) {
      console.error('Error creating priority metric:', err);
      setError('Failed to create priority metric. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Create Custom Priority Metric
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            Describe what types of cases you want to prioritize using natural language.
            The AI will create a custom prioritization function based on your description.
          </p>
        </div>
        
        <form onSubmit={handleCreateMetric} className="mt-5">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Priority Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows="4"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="E.g., Prioritize cases with STEM backgrounds and vulnerable family situations..."
                value={description}
                onChange={handleDescriptionChange}
              />
            </div>
          </div>
          
          <div className="mt-2">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none"
              onClick={() => setShowExamples(!showExamples)}
            >
              {showExamples ? 'Hide examples' : 'Show examples'}
            </button>
          </div>
          
          {showExamples && (
            <div className="mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700">Example Priority Descriptions</h4>
              <ul className="mt-2 space-y-2">
                {examples.map((example, index) => (
                  <li key={index} className="flex">
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => handleUseExample(example)}
                    >
                      {example}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {error && (
            <div className="mt-3 text-sm text-red-600">
              {error}
            </div>
          )}
          
          <div className="mt-5">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading || !description.trim()}
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
                  Creating Metric...
                </>
              ) : (
                'Create Priority Metric'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MetricCreator;
