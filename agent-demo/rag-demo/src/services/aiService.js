/**
 * AI Service for asylum processing demo
 * 
 * This service handles interactions with AI models (OpenAI)
 * for various features of the application.
 */

// For a real application, API endpoints for Cloud Functions
const FUNCTION_URLS = {
  SUMMARY_URL: "https://generate-summary-73s3dsgldq-uc.a.run.app",
  SEARCH_URL: " https://semantic-search-73s3dsgldq-uc.a.run.app",
  DISCREPANCY_URL: "https://us-central1-your-project-id.cloudfunctions.net/analyze_discrepancies"
};

/**
 * Generates a summary of an asylum interview transcript
 * @param {string} transcript - The full interview transcript
 * @param {Object} metadata - Metadata about the case
 * @returns {Promise<Object>} The generated summary
 */
export const generateInterviewSummary = async (transcript, metadata) => {
  try {
    console.log("Generating summary for case: ", metadata.case_id);
    
    // Call the cloud function
    const response = await fetch(FUNCTION_URLS.SUMMARY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        case_id: metadata.case_id
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    return {
      summary: data.summary,
      model: data.model,
      completionTokens: data.completionTokens,
      promptTokens: data.promptTokens,
      timestamp: data.timestamp || new Date().toISOString()
    };
  } catch (error) {
    console.error("Error generating summary:", error);
    
    // Fallback to avoid breaking the UI
    return {
      summary: `This is a fallback summary for case ${metadata.case_id}. The API request failed with error: ${error.message}. Please try again later.`,
      model: "error-fallback",
      completionTokens: 0,
      promptTokens: 0,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Performs semantic search across interview transcripts and summaries using RAG
 * @param {string} query - The search query
 * @param {Object} filters - Optional filters for the search
 * @returns {Promise<Array>} Search results
 */
export const semanticSearch = async (query, filters = {}) => {
  try {
    console.log("Performing semantic search for:", query, "with filters:", filters);
    
    // Call the RAG search cloud function
    const response = await fetch(FUNCTION_URLS.SEARCH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        filters
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Add additional client-side formatting for results display
    const enhancedResults = data.results.map(result => ({
      ...result,
      // Format snippet for display by highlighting search terms
      formattedSnippet: highlightSearchTerms(result.snippet, result.highlights)
    }));
    
    return {
      query: data.query,
      results: enhancedResults,
      response: data.response,
      resultCount: data.resultCount
    };
  } catch (error) {
    console.error("Error performing semantic search:", error);
    
    // Return empty results for UI to handle
    return {
      query,
      results: [],
      response: `Search failed: ${error.message}. Please try again later.`,
      resultCount: 0
    };
  }
};

/**
 * Helper function to highlight search terms in text
 * @param {string} text - Text to highlight
 * @param {Array<string>} terms - Terms to highlight
 * @returns {string} HTML with highlighted terms
 */
const highlightSearchTerms = (text, terms) => {
  if (!terms || terms.length === 0 || !text) return text;
  
  let highlightedText = text;
  const escapedTerms = terms.map(term => 
    term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape regex special chars
  );
  
  // Create regex that matches any of the terms (case insensitive)
  const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
  
  // Replace matches with highlighted spans
  highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
  
  return highlightedText;
};

/**
 * Analyzes discrepancies between two interview transcripts
 * @param {string} transcript1 - First interview transcript
 * @param {string} transcript2 - Second interview transcript
 * @param {Object} metadata1 - Metadata for first transcript
 * @param {Object} metadata2 - Metadata for second transcript
 * @returns {Promise<Object>} Analysis of discrepancies
 */
export const analyzeDiscrepancies = async (transcript1, transcript2, metadata1, metadata2) => {
  try {
    console.log("Analyzing discrepancies between cases:", metadata1.case_id, metadata2.case_id);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // For a real implementation, this would call the OpenAI or Gemini API
    
    // Return mock results for the demo
    return {
      discrepancyCount: 5,
      severity: "Medium",
      keyDiscrepancies: [
        {
          topic: "Date of persecution event",
          statement1: "The applicant stated the attack occurred on June 15, 2021",
          statement2: "The applicant claimed the incident happened in early July 2021",
          significance: "Medium",
          explanation: "This discrepancy of approximately 2-3 weeks could be due to memory issues under trauma, but affects timeline verification."
        },
        {
          topic: "Identity of persecutors",
          statement1: "The applicant identified government police officers as the perpetrators",
          statement2: "The applicant described the attackers as paramilitary forces aligned with the government",
          significance: "Low",
          explanation: "The distinction between official and unofficial government forces may be unclear to the applicant, especially if uniforms were similar."
        },
        {
          topic: "Number of family members affected",
          statement1: "The applicant stated three family members were also threatened",
          statement2: "The applicant mentioned five family members received threats",
          significance: "Medium",
          explanation: "This numerical discrepancy could affect credibility, though may depend on how 'family member' is defined."
        }
      ],
      consistencies: [
        "Core reason for seeking asylum remains consistent across both interviews",
        "Description of specific threats is substantially similar",
        "Timeline of exit from country of origin is consistent"
      ],
      recommendation: "The identified discrepancies are not substantial enough to undermine the core asylum claim. Further clarification should be sought regarding the date discrepancy and family member count."
    };
  } catch (error) {
    console.error("Error analyzing discrepancies:", error);
    throw new Error("Failed to analyze discrepancies");
  }
};

/**
 * Creates a prioritization function based on natural language description
 * @param {string} priorityDescription - Natural language description of prioritization criteria
 * @returns {Promise<Object>} The generated prioritization function and metadata
 */
export const createPriorityFunction = async (priorityDescription) => {
  try {
    console.log("Creating priority function from:", priorityDescription);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock response - in a real implementation this would use an LLM to create the function
    return {
      functionId: `priority_${Date.now()}`,
      description: priorityDescription,
      createdAt: new Date().toISOString(),
      model: "gpt-4",
      // This would be an actual function in a real implementation
      // For the demo, we'll just return a description of what it would do
      functionDescription: `This priority function would analyze case metadata to prioritize cases based on the following criteria derived from your description: 
        ${priorityDescription}`,
      priorityMetrics: [
        {
          name: "STEM Background",
          weight: 0.3,
          description: "Prioritizes applicants with STEM backgrounds"
        },
        {
          name: "Vulnerability",
          weight: 0.4,
          description: "Higher priority for vulnerable applicants based on country conditions"
        },
        {
          name: "Family Size",
          weight: 0.15,
          description: "Considers family size as a factor"
        },
        {
          name: "Time Sensitivity",
          weight: 0.15,
          description: "Accounts for time-sensitive nature of cases"
        }
      ]
    };
  } catch (error) {
    console.error("Error creating priority function:", error);
    throw new Error("Failed to create priority function");
  }
};

/**
 * Applies a prioritization function to a list of cases
 * @param {Array} cases - List of case metadata
 * @param {Object} priorityFunction - The priority function object
 * @returns {Promise<Array>} Prioritized cases with scores
 */
export const applyPriorityFunction = async (cases, priorityFunction) => {
  try {
    console.log("Applying priority function to cases:", cases.length);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would apply the actual function
    // For the demo, we'll simulate scoring based on the description
    
    const scoredCases = cases.map(caseData => {
      // Calculate mock priority scores based on the priority metrics
      const stemScore = caseData.has_stem_background ? 10 : 
                      (caseData.applicant_profession === "Healthcare" ? 8 : 
                       caseData.applicant_profession === "Education" ? 6 : 3);
      
      // Calculate vulnerability score based on various factors
      let vulnerabilityScore = 5; // Base score
      
      // Countries with higher vulnerability for this demo
      const highVulnerabilityCountries = [
        "Syria", "Afghanistan", "Ukraine", "Venezuela", "Myanmar"
      ];
      
      if (highVulnerabilityCountries.includes(caseData.country_of_origin)) {
        vulnerabilityScore += 3;
      }
      
      // Consider persecution grounds
      if (caseData.grounds_for_persecution === "LGBTQ+ identity" || 
          caseData.grounds_for_persecution === "Gender-based violence") {
        vulnerabilityScore += 2;
      }
      
      // Family size factor
      const familySizeScore = caseData.family_size > 1 ? Math.min(caseData.family_size * 1.5, 10) : 3;
      
      // Time factor - older cases get higher priority
      const interviewDate = new Date(caseData.interview_date);
      const now = new Date();
      const monthsWaiting = (now - interviewDate) / (1000 * 60 * 60 * 24 * 30);
      const timeScore = Math.min(monthsWaiting, 10);
      
      // Calculate weighted total score
      const totalScore = (
        stemScore * priorityFunction.priorityMetrics[0].weight +
        vulnerabilityScore * priorityFunction.priorityMetrics[1].weight +
        familySizeScore * priorityFunction.priorityMetrics[2].weight +
        timeScore * priorityFunction.priorityMetrics[3].weight
      ) * 10; // Scale to 0-100
      
      // Generate component scores and explanation
      return {
        ...caseData,
        priorityScore: parseFloat(totalScore.toFixed(2)),
        componentScores: {
          stemBackground: stemScore,
          vulnerability: vulnerabilityScore,
          familySize: familySizeScore,
          timeFactor: timeScore
        },
        priorityExplanation: `This case received a priority score of ${totalScore.toFixed(2)} based on ${priorityFunction.description}. 
        Key factors include: ${caseData.has_stem_background ? "STEM background" : "non-STEM background"}, 
        ${highVulnerabilityCountries.includes(caseData.country_of_origin) ? "high-vulnerability country of origin" : "standard country of origin"}, 
        family size of ${caseData.family_size}, and ${monthsWaiting.toFixed(1)} months since interview.`
      };
    });
    
    // Sort by priority score (descending)
    return scoredCases.sort((a, b) => b.priorityScore - a.priorityScore);
  } catch (error) {
    console.error("Error applying priority function:", error);
    throw new Error("Failed to apply priority function");
  }
};

export default {
  generateInterviewSummary,
  semanticSearch,
  analyzeDiscrepancies,
  createPriorityFunction,
  applyPriorityFunction
};
