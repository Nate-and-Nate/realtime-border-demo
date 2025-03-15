from flask import Request, Response, jsonify
import json
import firebase_admin
from firebase_admin import credentials, firestore
import openai
import logging
from firebase_functions.params import StringParam
from firebase_functions import https_fn, options
from datetime import datetime
import numpy as np

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
OPENAI_EMBEDDING_MODEL = StringParam('OPENAI_EMBEDDING_MODEL', 'text-embedding-3-small')
OPENAI_COMPLETION_MODEL = StringParam('OPENAI_COMPLETION_MODEL', 'gpt-4o-mini')

# Search configuration
TOP_K_RESULTS = 10  # Number of results to return
SIMILARITY_THRESHOLD = 0.5  # Minimum similarity score (0-1)
MAX_CONTEXT_TOKENS = 4000  # Maximum tokens for context in the completion prompt

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

@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],
        cors_methods=["GET", "POST"]
    )
)
def semantic_search(request: Request) -> Response:
    """
    Perform semantic search on asylum interview transcripts
    
    Expected payload:
    {
        "query": "string",  # Search query
        "filters": {        # Optional filters
            "country_of_origin": "string",
            "grounds_for_persecution": "string",
            "decision_outcome": "string",
            ...
        }
    }
    
    Returns:
    - Search results with relevant chunks and generated response
    """
    try:
        # Check method
        if request.method != 'POST':
            return jsonify({'error': 'Method not allowed'}), 405
        
        # Parse request data
        request_json = request.get_json(silent=True)
        if not request_json or 'query' not in request_json:
            return jsonify({'error': 'Search query is required'}), 400
        
        query = request_json['query']
        filters = request_json.get('filters', {})
        
        print(f"Processing search query: {query}")
        
        # Generate embedding for query
        query_embedding = generate_embedding(query)
        if not query_embedding:
            return jsonify({'error': 'Failed to generate embedding for query'}), 500
        
        print(f"Query embedding generated")
        
        # Start with default threshold and gradually lower it if no results found
        current_threshold = SIMILARITY_THRESHOLD
        min_threshold = 0.2
        similar_chunks = []
        
        while not similar_chunks and current_threshold > min_threshold:
            # Perform vector search with current threshold
            similar_chunks = find_similar_chunks(query_embedding, filters, current_threshold)
            
            print(f"Found {len(similar_chunks)} similar chunks with threshold {current_threshold}")
            
            # If no results and threshold can be lowered further, try again
            if not similar_chunks:
                current_threshold -= 0.15
                current_threshold = max(current_threshold, min_threshold)  # Don't go below min_threshold
                print(f"Lowering threshold to {current_threshold}")
        
        if not similar_chunks:
            return jsonify({
                'query': query,
                'results': [],
                'message': 'No matching results found, even with reduced similarity threshold'
            }), 200
        
        # Generate a response based on retrieved chunks
        response_text = generate_search_response(query, similar_chunks)
        
        print(f"Response generated: {response_text}")
        
        # Format and return results
        results = format_search_results(query, similar_chunks, response_text)
        print(f"Search results: {results}")
        
        return jsonify(results), 200
    
    except Exception as e:
        logging.error(f"Error in semantic search: {str(e)}")
        return jsonify({'error': f'Search failed: {str(e)}'}), 500

def generate_embedding(text):
    """Generate embedding vector for text using OpenAI API"""
    try:
        client = openai.OpenAI(api_key=OPENAI_API_KEY.value)
        
        response = client.embeddings.create(
            model=OPENAI_EMBEDDING_MODEL.value,
            input=text,
            encoding_format="float"
        )
        
        return response.data[0].embedding
    
    except Exception as e:
        logging.error(f"Error generating embedding: {str(e)}")
        return None

def find_similar_chunks(query_embedding, filters=None, threshold=None):
    """
    Find chunks similar to the query embedding, applying filters if provided
    
    Uses cosine similarity between the query embedding and stored chunk embeddings
    
    Args:
        query_embedding: The query embedding vector
        filters: Optional metadata filters to apply
        threshold: Similarity threshold, defaults to global SIMILARITY_THRESHOLD if None
    """
    # Use provided threshold or default to global threshold
    similarity_threshold = threshold if threshold is not None else SIMILARITY_THRESHOLD
    
    # Get all embeddings from Firestore
    embeddings_ref = db.collection("transcript_embeddings")
    
    # Apply metadata filters if provided
    # if filters:
    #     for key, value in filters.items():
    #         if value:  # Skip empty filters
    #             filter_key = f"metadata.{key}"
    #             embeddings_ref = embeddings_ref.where(filter_key, "==", value)
    
    # Get the chunks
    chunks = list(embeddings_ref.stream())
    
    if not chunks:
        print("No chunks found matching the filters")
        return []
    
    # Calculate similarity scores
    similar_chunks = []
    
    for chunk_doc in chunks:
        chunk_data = chunk_doc.to_dict()
        chunk_embedding = chunk_data.get('embedding')
        
        if not chunk_embedding:
            continue
        
        # Calculate cosine similarity
        similarity = cosine_similarity(query_embedding, chunk_embedding)
        
        # Only keep chunks above threshold
        if similarity >= similarity_threshold:
            similar_chunks.append({
                'id': chunk_doc.id,
                'case_id': chunk_data.get('case_id'),
                'content': chunk_data.get('content'),
                'chunk_index': chunk_data.get('chunk_index'),
                'metadata': chunk_data.get('metadata', {}),
                'similarity': similarity
            })
    
    # Sort by similarity (highest first)
    similar_chunks.sort(key=lambda x: x['similarity'], reverse=True)
    
    # Return top k results
    return similar_chunks[:TOP_K_RESULTS]

def cosine_similarity(vec1, vec2):
    """Calculate cosine similarity between two vectors"""
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    
    dot_product = np.dot(vec1, vec2)
    norm_vec1 = np.linalg.norm(vec1)
    norm_vec2 = np.linalg.norm(vec2)
    
    return dot_product / (norm_vec1 * norm_vec2)

def generate_search_response(query, similar_chunks):
    """Generate a response to the search query using retrieved context chunks"""
    try:
        # Create prompt with context from similar chunks
        context_parts = []
        
        for i, chunk in enumerate(similar_chunks):
            case_id = chunk['case_id']
            context_text = chunk['content']
            
            context_parts.append(f"[Document {i+1}] Case {case_id}, Excerpt:\n{context_text}\n")
        
        context = "\n".join(context_parts)
        
        system_prompt = """You are an expert immigration analyst helping with asylum case research. 
        You are given a search query and relevant excerpts from asylum interview transcripts. 
        Provide a helpful, concise response that directly addresses the search query using information found in the provided excerpts.
        
        Only use information that is explicitly present in the provided context. If the context doesn't contain information relevant to the query, acknowledge this limitation.
        
        For each key point in your response, indicate which document number(s) contain supporting evidence."""
        
        user_prompt = f"Query: {query}\n\nRelevant transcript excerpts:\n{context}"
        
        client = openai.OpenAI(api_key=OPENAI_API_KEY.value)
        
        response = client.chat.completions.create(
            model=OPENAI_COMPLETION_MODEL.value,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=800
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        logging.error(f"Error generating search response: {str(e)}")
        return "Failed to generate a response based on the search results."

def format_search_results(query, similar_chunks, response_text):
    """Format search results and add highlighting"""
    # Extract important terms from the query for highlighting
    important_terms = extract_important_terms(query)
    
    # Prepare results with highlighting
    results = []
    
    for chunk in similar_chunks:
        # Create snippet with highlighted terms
        snippet = chunk['content']
        
        # Determine the matching metadata field
        metadata_match = None
        query_lower = query.lower()
        
        for key, value in chunk['metadata'].items():
            if isinstance(value, str) and value.lower() in query_lower:
                metadata_match = f"{key}: {value}"
                break
        
        # Add to results
        results.append({
            'caseId': chunk['case_id'],
            'score': round(chunk['similarity'], 2),
            'snippet': snippet,
            'metadataMatch': metadata_match,
            'highlights': important_terms
        })
    
    return {
        'query': query,
        'results': results,
        'response': response_text,
        'resultCount': len(results)
    }

def extract_important_terms(query, min_length=4):
    """Extract important terms from query for highlighting"""
    # Simple extraction based on word length
    words = query.lower().split()
    important = [word for word in words if len(word) >= min_length]
    
    # Remove duplicates while preserving order
    seen = set()
    return [x for x in important if not (x in seen or seen.add(x))]
