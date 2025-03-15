"""
Embedding Generation Script for Asylum Transcripts

This script:
1. Fetches all transcripts and metadata from Firestore
2. Splits each transcript into overlapping chunks
3. Generates embeddings for each chunk using OpenAI's API
4. Stores the chunks and embeddings in a new Firestore collection
"""

import os
import json
import time
import argparse
import firebase_admin
from firebase_admin import credentials, firestore
import openai
import tiktoken
import uuid
from tqdm import tqdm
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# OpenAI configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSIONS = 1536  # Dimensions for text-embedding-3-small

# Chunking configuration
TARGET_CHUNK_SIZE = 250  # Target tokens per chunk
CHUNK_OVERLAP = 50  # Overlap tokens between chunks

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_creds.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_encoding():
    """Get the tokenizer for the model"""
    return tiktoken.get_encoding("cl100k_base")  # Used by text-embedding-3-small

def num_tokens(text, encoding=None):
    """Count tokens in a text string"""
    if encoding is None:
        encoding = get_encoding()
    return len(encoding.encode(text))

def chunk_text(text, metadata, encoding=None):
    """
    Split text into chunks of approximately target_size tokens with overlap
    
    Args:
        text: The transcript text to chunk
        metadata: Case metadata to include with each chunk
        encoding: Tokenizer encoding
    
    Returns:
        List of dictionaries containing chunk text, index, and metadata
    """
    if encoding is None:
        encoding = get_encoding()
    
    tokens = encoding.encode(text)
    chunks = []
    
    # If text is short enough, return as single chunk
    if len(tokens) <= TARGET_CHUNK_SIZE:
        return [{
            "content": text,
            "chunk_index": 0,
            "case_id": metadata["case_id"],
            "metadata": metadata
        }]
    
    # Split into overlapping chunks
    i = 0
    chunk_index = 0
    
    while i < len(tokens):
        # Get chunk of approximately target size
        chunk_end = min(i + TARGET_CHUNK_SIZE, len(tokens))
        chunk_tokens = tokens[i:chunk_end]
        chunk_text = encoding.decode(chunk_tokens)
        
        # Add to chunks list
        chunks.append({
            "content": chunk_text,
            "chunk_index": chunk_index,
            "case_id": metadata["case_id"],
            "metadata": metadata
        })
        
        # Move to next chunk with overlap
        i += (TARGET_CHUNK_SIZE - CHUNK_OVERLAP)
        chunk_index += 1
    
    return chunks

def generate_embedding(text, retries=3, backoff=2):
    """
    Generate embedding for text using OpenAI API with retry logic
    
    Args:
        text: Text to generate embedding for
        retries: Number of retry attempts
        backoff: Backoff factor for retries (exponential)
    
    Returns:
        Embedding vector or None on failure
    """
    client = openai.OpenAI(api_key=OPENAI_API_KEY)
    
    for attempt in range(retries):
        try:
            response = client.embeddings.create(
                model=EMBEDDING_MODEL,
                input=text,
                encoding_format="float"
            )
            return response.data[0].embedding
        
        except Exception as e:
            if attempt < retries - 1:
                sleep_time = backoff ** attempt
                print(f"Error generating embedding: {e}. Retrying in {sleep_time} seconds...")
                time.sleep(sleep_time)
            else:
                print(f"Failed to generate embedding after {retries} attempts: {e}")
                return None

def get_all_transcripts():
    """Fetch all transcripts and metadata from Firestore"""
    transcripts_ref = db.collection("transcripts")
    transcripts = list(transcripts_ref.stream())
    
    results = []
    for transcript_doc in transcripts:
        transcript_data = transcript_doc.to_dict()
        case_id = transcript_data.get("case_id")
        
        if not case_id:
            print(f"Warning: Transcript missing case_id: {transcript_doc.id}")
            continue
        
        # Get metadata for this case
        metadata_doc = db.collection("transcriptMetadata").document(case_id).get()
        if not metadata_doc.exists:
            print(f"Warning: No metadata found for case: {case_id}")
            continue
        
        metadata = metadata_doc.to_dict()
        results.append({
            "case_id": case_id,
            "transcript": transcript_data.get("content", ""),
            "metadata": metadata
        })
    
    return results

def store_embeddings(chunk_embeddings, batch_size=500):
    """
    Store chunk embeddings in Firestore using batched writes
    
    Args:
        chunk_embeddings: List of dictionaries with chunk and embedding data
        batch_size: Number of writes per batch
    """
    # Check if any embeddings already exist
    
    # Process in batches to avoid hitting Firestore limits
    batch_count = 0
    total_stored = 0
    
    for i in range(0, len(chunk_embeddings), batch_size):
        # Create a new batch
        batch = db.batch()
        current_batch = chunk_embeddings[i:i+batch_size]
        
        for chunk_data in current_batch:
            # Create a unique document ID (combination of case ID and chunk index)
            doc_id = f"{chunk_data['case_id']}_{chunk_data['chunk_index']}"
            
            # Create or update document
            doc_ref = db.collection("transcript_embeddings").document(doc_id)
            batch.set(doc_ref, chunk_data)
        
        # Commit the batch
        batch.commit()
        batch_count += 1
        total_stored += len(current_batch)
        print(f"Committed batch {batch_count}, total documents: {total_stored}")
    
    print(f"Successfully stored {total_stored} chunk embeddings in Firestore")

def main():
    # Initialize tokenizer
    encoding = get_encoding()
    
    # Get all transcripts and metadata
    print("Fetching transcripts and metadata...")
    cases = get_all_transcripts()
    print(f"Found {len(cases)} cases with transcripts and metadata")
    
    # Process each transcript
    total_chunks_processed = 0
    
    for case in tqdm(cases, desc="Processing cases"):
        case_id = case["case_id"]
        transcript = case["transcript"]
        metadata = case["metadata"]
        
        print(f"\nProcessing case {case_id}...")
        
        # Split transcript into chunks
        chunks = chunk_text(transcript, metadata, encoding)
        print(f"Split into {len(chunks)} chunks")
        
        # Process chunks and store embeddings for this case
        case_chunk_embeddings = []
        
        # Generate embeddings for each chunk
        for chunk in tqdm(chunks, desc="Generating embeddings"):
            # Generate embedding
            embedding = generate_embedding(chunk["content"])
            
            if embedding:
                # Add embedding to chunk data
                chunk_with_embedding = {
                    "case_id": chunk["case_id"],
                    "content": chunk["content"],
                    "chunk_index": chunk["chunk_index"],
                    "metadata": chunk["metadata"],
                    "embedding": embedding
                }
                case_chunk_embeddings.append(chunk_with_embedding)
            
            # Avoid rate limits
            time.sleep(0.1)
        
        # Store embeddings for this case immediately
        print(f"Storing {len(case_chunk_embeddings)} chunk embeddings for case {case_id}...")
        store_embeddings(case_chunk_embeddings, batch_size=100)  # Reduced batch size for safety
        total_chunks_processed += len(case_chunk_embeddings)
    
    print(f"Embedding generation complete! Processed {total_chunks_processed} chunks across {len(cases)} cases.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate embeddings for asylum transcripts")
    args = parser.parse_args()
    main()
