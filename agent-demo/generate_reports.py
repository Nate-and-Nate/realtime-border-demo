# Decision outcomes with probability weights (reflecting real-world grant rates)
DECISION_OUTCOMES = {
    "Granted": 0.28,  # ~28% approval rate for asylum cases
    "Denied": 0.50,   # ~50% denial rate
    "Referred to Immigration Court": 0.12,
    "Administrative Closure": 0.05,
    "Withdrawn": 0.03,
    "Abandoned": 0.02
}
import os
import json
import random
from openai import OpenAI
from datetime import datetime, timedelta
import time

# Initialize the OpenAI client
client = OpenAI(api_key="AIzaSyAWuutixmlf4rcTIkSYCt-1UFqLNWLH7Kc", base_url="https://generativelanguage.googleapis.com/v1beta/openai/")

# Configuration variables
TRANSCRIPTS_DIR = "asylum_transcripts/transcripts"
METADATA_DIR = "asylum_transcripts/metadata"
OUTPUT_DIR = "asylum_transcripts"
NUM_TRANSCRIPTS = 75  # Adjust as needed, will generate this many transcripts
MODEL = "gemini-2.0-flash"  
CONSOLIDATED_METADATA_FILE = "asylum_transcripts/all_cases.json"

# Create output directories if they don't exist
os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)
os.makedirs(METADATA_DIR, exist_ok=True)

# Case type options with probability weights
CASE_TYPES = {
    "Affirmative Asylum": 0.65,  # More common
    "Defensive Asylum": 0.25,    # Less common
    "Credible Fear Interview": 0.10  # Least common
}

# Country data - common countries of origin for asylum seekers with probability weights
COUNTRIES_OF_ORIGIN = {
    # High-volume countries
    "Venezuela": 0.12,
    "Guatemala": 0.11,
    "Honduras": 0.10,
    "El Salvador": 0.09,
    "Haiti": 0.08,
    # Medium-volume countries
    "Nicaragua": 0.07,
    "Cuba": 0.06,
    "Colombia": 0.05,
    "China": 0.05,
    "Mexico": 0.04,
    # Lower-volume but significant countries
    "Ukraine": 0.03,
    "Afghanistan": 0.03,
    "Syria": 0.03,
    "Myanmar": 0.02,
    "Russia": 0.02,
    "Cameroon": 0.02,
    "Eritrea": 0.02,
    # Other countries with fewer cases
    "Ethiopia": 0.01,
    "Nigeria": 0.01,
    "Iraq": 0.01,
    "Turkey": 0.01,
    "Sudan": 0.01,
    "South Sudan": 0.01,
    "Democratic Republic of Congo": 0.01
}

# Persecution grounds with probability weights
PERSECUTION_GROUNDS = {
    "Membership in a particular social group": 0.30,  # Most common ground
    "Political opinion": 0.25,
    "Religion": 0.15,
    "Nationality": 0.10,
    "Race": 0.10,
    "Gender-based violence": 0.05,
    "LGBTQ+ identity": 0.05
}

# Educational attainment levels with probability weights
EDUCATION_LEVELS = {
    "No formal education": 0.10,
    "Primary education": 0.15,
    "Secondary education": 0.35,
    "Bachelor's degree": 0.25,
    "Master's degree": 0.10,
    "Doctoral degree": 0.05
}

# Professional fields with probability weights
PROFESSIONAL_FIELDS = {
    "Agriculture/Farming": 0.15,
    "STEM": 0.10,
    "Healthcare": 0.08,
    "Education": 0.10,
    "Business/Finance": 0.10,
    "Trades/Construction": 0.12,
    "Service Industry": 0.15,
    "Arts/Culture": 0.05,
    "Government/Military": 0.05,
    "Legal": 0.03,
    "Unemployed": 0.07
}

# Language proficiency levels
LANGUAGE_PROFICIENCY = ["None", "Basic", "Intermediate", "Advanced", "Fluent", "Native"]

# Special considerations that might interest government officials
SPECIAL_CONSIDERATIONS = {
    "None": 0.60,
    "Family ties to citizens": 0.10,
    "Critical skill shortage area": 0.05,
    "Victim of trafficking": 0.05,
    "Cooperation with allied forces": 0.03,
    "Human rights activist": 0.05,
    "Religious leadership": 0.02,
    "Prior legal status in country": 0.10
}

def weighted_choice(choices_dict):
    """Select a random item from a dictionary based on weighted probabilities"""
    items = list(choices_dict.keys())
    weights = list(choices_dict.values())
    return random.choices(items, weights=weights, k=1)[0]

def generate_interview_metadata():
    """Generate realistic metadata for an asylum interview with weighted probabilities"""
    # Select case type, country, and persecution grounds using weighted probabilities
    case_type = weighted_choice(CASE_TYPES)
    country = weighted_choice(COUNTRIES_OF_ORIGIN)
    persecution_grounds = weighted_choice(PERSECUTION_GROUNDS)
    
    # Generate a random date within the last 3 years
    interview_date = datetime.now() - timedelta(days=random.randint(1, 1095))
    
    # Decision date is typically 2 weeks to 6 months after interview
    decision_date = interview_date + timedelta(days=random.randint(14, 180))
    
    # Randomly assign gender and age
    gender = random.choice(["male", "female", "non-binary"])
    age = random.randint(18, 65)
    
    # Select decision outcome using weighted probabilities
    decision_outcome = weighted_choice(DECISION_OUTCOMES)
    
    # Generate relevant officers based on case type
    asylum_officer_id = f"AO-{random.randint(1000, 9999)}"
    immigration_judge_id = f"IJ-{random.randint(100, 999)}" if case_type == "Defensive Asylum" else None
    
    # Education and professional background
    education_level = weighted_choice(EDUCATION_LEVELS)
    professional_field = weighted_choice(PROFESSIONAL_FIELDS)
    
    # Language skills - determine number of languages
    num_languages = random.choices([1, 2, 3, 4], weights=[0.4, 0.3, 0.2, 0.1], k=1)[0]
    languages = {}
    native_language = country  # Simplification - using country name as proxy for language
    languages[native_language] = "Native"
    
    # Add additional languages if applicable
    possible_languages = ["English", "Spanish", "French", "Arabic", "Mandarin", "Russian", "Portuguese"]
    if "English" not in languages and random.random() < 0.7:  # 70% chance of some English
        languages["English"] = random.choice(LANGUAGE_PROFICIENCY[1:5])  # Basic to Advanced
    
    # Add other random languages
    for _ in range(num_languages - len(languages)):
        lang = random.choice(possible_languages)
        if lang not in languages:
            languages[lang] = random.choice(LANGUAGE_PROFICIENCY[1:5])
    
    # Special considerations
    special_consideration = weighted_choice(SPECIAL_CONSIDERATIONS)
    if special_consideration == "None":
        special_consideration = None
    
    # Generate metadata with all required fields
    return {
        # Required categories
        "case_type": case_type,
        "country_of_origin": country,
        "grounds_for_persecution": persecution_grounds,
        "decision_outcome": decision_outcome,
        "interview_date": interview_date.strftime("%Y-%m-%d"),
        "decision_date": decision_date.strftime("%Y-%m-%d"),
        
        # Identifiers
        "case_id": f"A{random.randint(100000, 999999)}",
        
        # Demographics
        "applicant_gender": gender,
        "applicant_age": age,
        "applicant_education": education_level,
        "applicant_profession": professional_field,
        
        # Languages
        "languages": languages,
        "english_proficiency": languages.get("English", "None"),
        "interpreter_needed": "English" not in languages or languages.get("English") in ["None", "Basic"],
        "interpreter_language": native_language if "English" not in languages or languages.get("English") in ["None", "Basic"] else None,
        
        # Special factors of interest to government
        "special_consideration": special_consideration,
        "has_stem_background": professional_field == "STEM",
        "has_healthcare_background": professional_field == "Healthcare",
        "has_legal_representation": random.random() < 0.35,  # ~35% have legal representation
        "has_dependent_family_members": random.random() < 0.40,  # ~40% have family members on application
        "family_size": random.randint(1, 6) if random.random() < 0.40 else 1,
        "years_in_origin_country": random.randint(age - 10, age) if age > 10 else age,
        
        # Officer information
        "asylum_officer_id": asylum_officer_id,
        "immigration_judge_id": immigration_judge_id
    }

def create_system_prompt(metadata):
    """Create a system prompt for the LLM to generate an asylum interview"""
    # Determine interpreter information
    interpreter_info = ""
    if metadata['interpreter_needed']:
        interpreter_info = f"Interpreter: {metadata['interpreter_language']} interpreter present"
    else:
        interpreter_info = "Interpreter: None needed"
    
    # Determine specific context based on case type
    case_specific_context = ""
    if metadata['case_type'] == "Affirmative Asylum":
        case_specific_context = "This is an affirmative asylum interview where the applicant proactively applied for asylum while legally in the United States."
    elif metadata['case_type'] == "Defensive Asylum":
        case_specific_context = "This is a defensive asylum hearing where the applicant is in removal proceedings and is using asylum as a defense against deportation."
    else:  # Credible Fear Interview
        case_specific_context = "This is a credible fear interview to determine if the applicant has a credible fear of persecution if returned to their home country."
    
    # Create appropriate prompt based on decision outcome
    outcome_context = ""
    if metadata['decision_outcome'] == "Granted":
        outcome_context = "The interview should contain compelling, detailed, and consistent testimony that clearly establishes eligibility for asylum."
    elif metadata['decision_outcome'] == "Denied":
        outcome_context = "The interview should contain some inconsistencies, gaps in information, or credibility issues that would reasonably lead to a denial."
    elif "Referred" in metadata['decision_outcome']:
        outcome_context = "The interview should contain testimony that raises complex issues requiring further review by an immigration judge."
    else:
        outcome_context = "The interview should proceed normally but might not reach a clear resolution."
    
    # Special considerations context
    special_context = ""
    if metadata['special_consideration']:
        special_context = f"The applicant has a special consideration: {metadata['special_consideration']}."
    
    # Educational and professional background context
    background_context = f"The applicant has {metadata['applicant_education']} and background in {metadata['applicant_profession']}."
    
    return f"""
You are simulating an asylum interview transcript for a {metadata['case_type']} case.

CASE DETAILS:
- Applicant from {metadata['country_of_origin']}
- {metadata['applicant_age']}-year-old {metadata['applicant_gender']} 
- Seeking asylum based on fear of persecution due to {metadata['grounds_for_persecution']}
- Education: {metadata['applicant_education']}
- Professional background: {metadata['applicant_profession']}
- English proficiency: {metadata['english_proficiency']}
- Legal representation: {"Present" if metadata['has_legal_representation'] else "None"}
- Dependent family members on application: {"Yes" if metadata['has_dependent_family_members'] else "No"}
- Family size: {metadata['family_size']}
{special_context}

CONTEXT:
{case_specific_context}
{outcome_context}
{background_context}

The transcript should follow this format:

```
ASYLUM INTERVIEW TRANSCRIPT
Case ID: {metadata['case_id']}
Case Type: {metadata['case_type']}
Date of Interview: {metadata['interview_date']}
Asylum Officer: {metadata['asylum_officer_id']}
{interpreter_info}

INTERVIEW BEGINS

OFFICER: [Standard introduction about the asylum process and oath]

APPLICANT: [Response to oath]

[... rest of the interview ...]

INTERVIEW ENDS
```

Create a realistic, detailed interview that covers:
1. The applicant's background and identity
2. Educational history and professional experience (incorporate details consistent with their stated education and profession)
3. Specific reasons for leaving their country related to the grounds for persecution
4. Detailed incidents of persecution or fear (with dates, locations, and individuals involved)
5. Attempts to relocate within their country or seek protection from authorities
6. Why they cannot return to their country of origin
7. Supporting evidence they have or have submitted
8. Family situation and whether family members are at risk
9. Travel to the United States (route, timeline, mode of entry)
10. Future plans if granted asylum (especially related to their professional expertise)

The officer should include questions that explore the applicant's:
- Educational credentials and how they were obtained
- Professional skills and how they might be utilized in the United States
- Language abilities and integration potential
- Any special considerations noted in their file

Make the transcript believable but varied. Include:
- Natural language patterns and speech characteristics appropriate for someone with the stated English proficiency
- Hesitations, clarifications, and occasional miscommunications
- Officer follow-up questions that probe inconsistencies or vague responses
- If legal representation is present, occasional input from the representative
- Questions that test the credibility and plausibility of the applicant's claims

The transcript should be 1500-2500 words long and accurately reflect a case that would reasonably result in the specified decision outcome ({metadata['decision_outcome']}).
"""

def generate_transcript(metadata):
    """Generate an asylum interview transcript using the OpenAI API"""
    system_prompt = create_system_prompt(metadata)
    
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Generate a complete asylum interview transcript following the provided format and guidelines."}
            ],
            temperature=0.8,
            max_tokens=4000
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating transcript: {e}")
        return None

def save_transcript(transcript, metadata, index, all_metadata):
    """Save the generated transcript to a file and update the consolidated metadata"""
    # Create a base filename using case ID
    base_filename = f"{metadata['case_id']}"
    transcript_filename = f"{TRANSCRIPTS_DIR}/{base_filename}.txt"
    
    # Save transcript
    with open(transcript_filename, "w", encoding="utf-8") as f:
        f.write(transcript)
    
    # Save individual metadata
    metadata_filename = f"{METADATA_DIR}/{base_filename}_metadata.json"
    with open(metadata_filename, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    
    # Add transcript filename to metadata
    metadata["transcript_filename"] = f"{base_filename}.txt"
    
    # Update the consolidated metadata
    all_metadata.append(metadata)
    
    print(f"Generated transcript {index+1}/{NUM_TRANSCRIPTS}: {base_filename}")

def main():
    """Main function to generate multiple transcripts"""
    print(f"Generating {NUM_TRANSCRIPTS} asylum interview transcripts...")
    
    # Create a list to store all metadata
    all_metadata = []
    
    for i in range(NUM_TRANSCRIPTS):
        metadata = generate_interview_metadata()
        transcript = generate_transcript(metadata)
        
        if transcript:
            save_transcript(transcript, metadata, i, all_metadata)
            
            # Add delay to avoid hitting API rate limits
            if i < NUM_TRANSCRIPTS - 1:
                time.sleep(0.1)
    
    # Save the consolidated metadata to a single JSON file
    with open(CONSOLIDATED_METADATA_FILE, "a", encoding="utf-8") as f:
        json.dump(all_metadata, f, indent=2)
    
    print(f"Successfully generated {NUM_TRANSCRIPTS} transcripts")
    print(f"Transcripts are in '{TRANSCRIPTS_DIR}'")
    print(f"Individual metadata files are in '{METADATA_DIR}'")
    print(f"Consolidated metadata is in '{CONSOLIDATED_METADATA_FILE}'")

if __name__ == "__main__":
    main()

    