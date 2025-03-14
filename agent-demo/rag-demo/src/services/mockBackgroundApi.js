/**
 * Mock Background Check API Service
 * 
 * This service simulates an API that performs background checks on asylum applicants.
 * It returns realistic probability distributions for various risk factors.
 */

// Base rate of criminal records based on country of origin
// This is just for demo purposes - not based on real data
const countryRiskFactors = {
    "Venezuela": 0.04,
    "Guatemala": 0.03,
    "Honduras": 0.05,
    "El Salvador": 0.06,
    "Haiti": 0.03,
    "Nicaragua": 0.02,
    "Cuba": 0.01,
    "Colombia": 0.04,
    "China": 0.01,
    "Mexico": 0.03,
    "Ukraine": 0.01,
    "Afghanistan": 0.02,
    "Syria": 0.02,
    "Myanmar": 0.01,
    "Russia": 0.02,
    "Cameroon": 0.02,
    "Eritrea": 0.03,
    "Ethiopia": 0.02,
    "Nigeria": 0.03,
    "Iraq": 0.03,
    "Turkey": 0.01,
    "Sudan": 0.03,
    "South Sudan": 0.04,
    "Democratic Republic of Congo": 0.04,
    // Default for other countries
    "default": 0.02
  };
  
  // Modifiers based on case characteristics
  const modifiers = {
    age: (age) => {
      if (age < 25) return 0.01;
      if (age > 50) return -0.01;
      return 0;
    },
    education: (level) => {
      const educationLevels = {
        "No formal education": 0.01,
        "Primary education": 0.005,
        "Secondary education": 0,
        "Bachelor's degree": -0.005,
        "Master's degree": -0.008,
        "Doctoral degree": -0.01
      };
      return educationLevels[level] || 0;
    },
    hasLegalRepresentation: (hasRep) => hasRep ? -0.005 : 0.005
  };
  
  // Types of potential criminal offenses for the simulation
  const criminalOffenseTypes = [
    { type: "Minor non-violent offense", probability: 0.6 },
    { type: "Major non-violent offense", probability: 0.25 },
    { type: "Minor violent offense", probability: 0.1 },
    { type: "Major violent offense", probability: 0.05 }
  ];
  
  // Generate a list of offenses based on probability
  const generateOffenses = (count) => {
    const offenses = [];
    for (let i = 0; i < count; i++) {
      const random = Math.random();
      let cumulativeProbability = 0;
      for (const offense of criminalOffenseTypes) {
        cumulativeProbability += offense.probability;
        if (random <= cumulativeProbability) {
          offenses.push({
            type: offense.type,
            date: randomDate(new Date(2000, 0, 1), new Date(2023, 0, 1)),
            description: `Simulated ${offense.type.toLowerCase()} for demo purposes`
          });
          break;
        }
      }
    }
    return offenses;
  };
  
  // Helper function to generate random dates
  const randomDate = (start, end) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  };
  
  // Generate identity verification status with probabilities
  const generateIdentityVerification = () => {
    const random = Math.random();
    if (random > 0.95) {
      return { status: "Failed", reason: "Inconsistent documentation" };
    } else if (random > 0.85) {
      return { status: "Partial", reason: "Some documentation could not be verified" };
    } else {
      return { status: "Verified", reason: null };
    }
  };
  
  // Generate travel history verification
  const generateTravelHistory = (countryOfOrigin) => {
    const statuses = ["Verified", "Partial", "Incomplete"];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    const status = statuses[randomIndex];
    
    // Generate some plausible travel history
    const countries = [countryOfOrigin];
    const transitCountries = {
      "Venezuela": ["Colombia", "Panama", "Costa Rica"],
      "Guatemala": ["Mexico"],
      "Honduras": ["Guatemala", "Mexico"],
      "El Salvador": ["Guatemala", "Mexico"],
      "Haiti": ["Dominican Republic", "Bahamas"],
      "Afghanistan": ["Pakistan", "Iran", "Turkey"],
      "Syria": ["Turkey", "Lebanon", "Jordan"],
      // Add more transit routes as needed
      "default": ["Unknown transit country"]
    };
    
    const possibleTransit = transitCountries[countryOfOrigin] || transitCountries.default;
    const transitCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < transitCount; i++) {
      const randomCountry = possibleTransit[Math.floor(Math.random() * possibleTransit.length)];
      countries.push(randomCountry);
    }
    
    countries.push("United States");
    
    return {
      status,
      countries: countries.map(country => ({
        name: country,
        entryDate: country === countryOfOrigin ? null : randomDate(new Date(2020, 0, 1), new Date()),
        exitDate: country === "United States" ? null : randomDate(new Date(2020, 0, 1), new Date())
      }))
    };
  };
  
  // Generate watchlist check results
  const generateWatchlistResults = (baseRisk) => {
    const random = Math.random();
    if (random < baseRisk * 5) { // Rare but possible
      return { 
        status: "Flag",
        level: "Low",
        reason: "Name similarity with watchlist entry, requires further verification"
      };
    } else if (random < baseRisk * 10) {
      return {
        status: "Info",
        level: "Informational",
        reason: "Previous border crossing alert, non-critical"
      };
    } else {
      return {
        status: "Clear",
        level: null,
        reason: null
      };
    }
  };
  
  /**
   * Performs a mock background check for an asylum applicant
   * @param {Object} applicantData - The applicant's metadata
   * @returns {Object} Background check results
   */
  export const performBackgroundCheck = (applicantData) => {
    // Calculate base risk based on country of origin
    const countryFactor = countryRiskFactors[applicantData.country_of_origin] || countryRiskFactors.default;
    
    // Apply modifiers
    let modifiedRisk = countryFactor;
    modifiedRisk += modifiers.age(applicantData.applicant_age);
    modifiedRisk += modifiers.education(applicantData.applicant_education);
    modifiedRisk += modifiers.hasLegalRepresentation(applicantData.has_legal_representation);
    
    // Ensure the risk is within 0 to 1 range
    modifiedRisk = Math.max(0, Math.min(modifiedRisk, 1));
    
    // Determine if the applicant has a criminal record
    const hasCriminalRecord = Math.random() < modifiedRisk;
    
    // Generate the number of offenses
    const offenseCount = hasCriminalRecord ? Math.floor(Math.random() * 3) + 1 : 0;
    
    // Generate identity verification status
    const identityVerification = generateIdentityVerification();
    
    // Generate travel history
    const travelHistory = generateTravelHistory(applicantData.country_of_origin);
    
    // Generate watchlist check
    const watchlistCheck = generateWatchlistResults(modifiedRisk);
    
    // Add some processing delay to simulate a real API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          caseId: applicantData.case_id,
          checkDate: new Date().toISOString().split('T')[0],
          riskScore: parseFloat((modifiedRisk * 100).toFixed(2)),
          criminalRecord: {
            status: hasCriminalRecord ? "Found" : "None",
            offenseCount,
            offenses: generateOffenses(offenseCount)
          },
          identityVerification,
          travelHistory,
          watchlistCheck,
          recommendations: {
            furtherInvestigationRequired: offenseCount > 0 || identityVerification.status === "Failed" || watchlistCheck.status === "Flag",
            inPersonInterviewRecommended: offenseCount > 1 || identityVerification.status !== "Verified" || watchlistCheck.status !== "Clear",
            expeditedProcessingEligible: offenseCount === 0 && identityVerification.status === "Verified" && watchlistCheck.status === "Clear"
          }
        });
      }, 1500); // Simulate API delay of 1.5 seconds
    });
  };
  
  export default performBackgroundCheck;
  