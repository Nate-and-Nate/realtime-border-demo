/**
 * AI Service for asylum processing demo
 * 
 * This service handles interactions with AI models (OpenAI and Google's Gemini)
 * for various features of the application.
 */

// For a real application, you would need to set up your API keys securely
// For this demo, we'll use placeholder values
const OPENAI_API_KEY = "your-openai-api-key";
const GEMINI_API_KEY = "your-gemini-api-key";

// Base URLs for AI APIs
const OPENAI_BASE_URL = "https://api.openai.com/v1";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai";

/**
 * Generates a summary of an asylum interview transcript
 * @param {string} transcript - The full interview transcript
 * @param {Object} metadata - Metadata about the case
 * @returns {Promise<Object>} The generated summary
 */
export const generateInterviewSummary = async (transcript, metadata) => {
  try {
    // In a real application, you would make an API call to OpenAI
    // For this demo, we'll simulate the API call
    
    console.log("Generating summary for case: ", metadata.case_id);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For a real implementation, you would use:
    /*
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert immigration analyst. Summarize the following asylum interview transcript concisely, highlighting key claims, credibility factors, and relevant details for determining asylum eligibility.'
          },
          {
            role: 'user',
            content: `Please summarize this asylum interview transcript for case ${metadata.case_id}:\n\n${transcript}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });
    
    const data = await response.json();
    return {
      summary: data.choices[0].message.content,
      model: data.model,
      completionTokens: data.usage.completion_tokens,
      promptTokens: data.usage.prompt_tokens
    };
    */
    
    // Return mock data for demo
    return {
      summary: `This is a summary of the asylum interview for case ${metadata.case_id}. 
      
The applicant is a ${metadata.applicant_age}-year-old ${metadata.applicant_gender} from ${metadata.country_of_origin} seeking asylum based on ${metadata.grounds_for_persecution}. The applicant has a ${metadata.applicant_education} and background in ${metadata.applicant_profession}.

Key claims:
- Faced persecution due to [specific details that would be extracted from transcript]
- Attempted to relocate within country but [details from transcript]
- Cannot return because [reasons from transcript]

Credibility assessment:
- The applicant provided [consistent/inconsistent] testimony about key events
- [Details about documentation provided]
- [Notes about demeanor during interview]

The asylum officer ${metadata.asylum_officer_id} conducted the interview on ${metadata.interview_date}. The decision was made on ${metadata.decision_date} to ${metadata.decision_outcome.toLowerCase()} the application.`,
      model: "gpt-4",
      completionTokens: 350,
      promptTokens: 1200,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate interview summary");
  }
};

/**
 * Performs semantic search across interview transcripts and summaries
 * @param {string} query - The search query
 * @returns {Promise<Array>} Search results
 */
export const semanticSearch = async (query) => {
  try {
    console.log("Performing semantic search for:", query);
    
    // In a real implementation, this would be a call to your RAG system in Firebase Cloud Functions
    // For this demo, we'll simulate the results
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock search results
    return [
      {
        caseId: "A123456",
        score: 0.92,
        snippet: "The applicant described fleeing due to political persecution after participating in protests against the government.",
        metadataMatch: "Political opinion persecution",
        highlights: ["political persecution", "protests", "government"]
      },
      {
        caseId: "A789012",
        score: 0.87,
        snippet: "The asylum seeker testified about government officials threatening them after they spoke at opposition rallies.",
        metadataMatch: "Political opinion persecution",
        highlights: ["government officials", "threatening", "opposition rallies"]
      },
      {
        caseId: "A345678",
        score: 0.81,
        snippet: "The claimant was forced to flee after receiving death threats for their political activities.",
        metadataMatch: "Political opinion persecution",
        highlights: ["death threats", "political activities"]
      }
    ];
  } catch (error) {
    console.error("Error performing semantic search:", error);
    throw new Error("Failed to perform semantic search");
  }
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
