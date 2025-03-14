from flask import Request, Response, jsonify
import json
import firebase_admin
from firebase_admin import credentials, firestore
import openai
import logging
from firebase_functions.params import StringParam
from firebase_functions import https_fn, options
from datetime import datetime

# Initialize Firebase Admin SDK
try:
    cred = credentials.Certificate("firebase_creds.json")
    firebase_admin.initialize_app(cred)
except ValueError:
    # App already initialized
    pass

db = firestore.client()

# Initialize OpenAI API key as StringParam
OPENAI_API_KEY = StringParam('OPENAI_API_KEY')
OPENAI_MODEL = StringParam('OPENAI_MODEL', 'gpt-4o-mini')

@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],
        cors_methods=["GET", "POST"]
    )
)
def generate_summary(request: Request) -> Response:
    """
    Generate summary of asylum interview transcript using OpenAI.
    
    Expected payload:
    {
        "case_id": "A123456"
    }
    
    Returns:
    - Summary object with the AI-generated summary and metadata
    """
    try:
        if request.method != 'POST':
            return jsonify({'error': 'Method not allowed'}), 405
        
        # Parse request data
        request_json = request.get_json(silent=True)
        if not request_json or 'case_id' not in request_json:
            return jsonify({'error': 'case_id is required'}), 400
        
        case_id = request_json['case_id']
        logging.info(f"Generating summary for case: {case_id}")
        
        # Get transcript and metadata
        transcript_data = get_transcript(case_id)
        if not transcript_data:
            return jsonify({'error': f'Transcript not found for case_id: {case_id}'}), 404
        
        metadata = get_metadata(case_id)
        if not metadata:
            return jsonify({'error': f'Metadata not found for case_id: {case_id}'}), 404
        
        # Check if summary already exists
        existing_summary = get_existing_summary(case_id)
        if existing_summary:
            logging.info(f"Found existing summary for case: {case_id}")
            return jsonify(existing_summary), 200
        
        # Generate summary with OpenAI
        summary_data = generate_summary_with_openai(case_id, transcript_data, metadata)
        
        # Store summary in Firestore
        store_summary(case_id, summary_data)
        
        return jsonify(summary_data), 200
    
    except Exception as e:
        logging.error(f"Error generating summary: {str(e)}")
        return jsonify({'error': f'Failed to generate summary: {str(e)}'}), 500

def get_transcript(case_id):
    """Retrieve transcript from Firestore"""
    try:
        transcript_doc = db.collection('transcripts').document(case_id).get()
        if not transcript_doc.exists:
            return None
        
        transcript_data = transcript_doc.to_dict()
        return transcript_data.get('content', '')
    except Exception as e:
        logging.error(f"Error fetching transcript: {str(e)}")
        return None

def get_metadata(case_id):
    """Retrieve case metadata from Firestore"""
    try:
        metadata_doc = db.collection('transcriptMetadata').document(case_id).get()
        if not metadata_doc.exists:
            return None
        
        return metadata_doc.to_dict()
    except Exception as e:
        logging.error(f"Error fetching metadata: {str(e)}")
        return None

def get_existing_summary(case_id):
    """Check if summary already exists"""
    try:
        summary_doc = db.collection('summaries').document(case_id).get()
        if summary_doc.exists:
            return summary_doc.to_dict()
        return None
    except Exception as e:
        logging.error(f"Error checking existing summary: {str(e)}")
        return None

def generate_summary_with_openai(case_id, transcript_content, metadata):
    """Generate summary using OpenAI API"""
    try:
        # Configure OpenAI client
        client = openai.OpenAI(api_key=OPENAI_API_KEY.value)
        
        # Create prompt for summarization
        system_prompt = """You are an expert immigration analyst. Summarize the following asylum interview transcript concisely, highlighting key claims, credibility factors, and relevant details for determining asylum eligibility. 
        
        Structure your summary as follows:
        
        1. Basic Information: Applicant profile and case details
        2. Key Claims: Main reasons for seeking asylum
        3. Credibility Assessment: Consistency, plausibility, demeanor notes
        4. Supporting Evidence: Documentation or testimony provided
        5. Relevant Factors: Any special considerations or vulnerabilities
        6. Recommendation: Brief assessment of eligibility based on transcript
        """
        
        user_prompt = f"Please summarize this asylum interview transcript for case {case_id}:\n\nApplicant details:\n- {metadata['applicant_age']}-year-old {metadata['applicant_gender']} from {metadata['country_of_origin']}\n- Grounds for persecution: {metadata['grounds_for_persecution']}\n- Decision outcome: {metadata['decision_outcome']}\n\nTranscript:\n{transcript_content}"
        
        # Call OpenAI API
        logging.info(f"Calling OpenAI API for case: {case_id}")
        response = client.chat.completions.create(
            model=OPENAI_MODEL.value,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )
        
        summary_text = response.choices[0].message.content
        
        # Create summary object
        return {
            "case_id": case_id,
            "summary": summary_text,
            "model": OPENAI_MODEL.value,
            "promptTokens": response.usage.prompt_tokens,
            "completionTokens": response.usage.completion_tokens,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logging.error(f"Error calling OpenAI API: {str(e)}")
        raise

def store_summary(case_id, summary_data):
    """Store summary in Firestore"""
    try:
        db.collection('summaries').document(case_id).set(summary_data)
        logging.info(f"Summary stored in Firestore for case: {case_id}")
    except Exception as e:
        logging.error(f"Error storing summary: {str(e)}")
        # Continue execution even if storage fails
