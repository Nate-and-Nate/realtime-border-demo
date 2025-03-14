import json
import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

def upload_to_firebase():
    """
    Upload interview transcripts and metadata to Firebase Firestore.
    """
    # Path configurations
    base_dir = "asylum_transcripts"
    metadata_path = os.path.join(base_dir, "all_cases.json")
    transcripts_dir = os.path.join(base_dir, "transcripts")
    creds_path = "firebase_creds.json"

    # Initialize Firebase
    try:
        cred = credentials.Certificate(creds_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("Successfully connected to Firebase")
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        return

    # Load metadata
    try:
        with open(metadata_path, 'r', encoding='utf-8') as file:
            metadata_list = json.load(file)
        print(f"Loaded metadata for {len(metadata_list)} cases")
    except Exception as e:
        print(f"Error loading metadata: {e}")
        return

    # Upload metadata and transcripts
    metadata_collection = db.collection('transcriptMetadata')
    transcripts_collection = db.collection('transcripts')
    
    success_count = 0
    error_count = 0
    
    for case_metadata in metadata_list:
        try:
            # Get case ID
            case_id = case_metadata['case_id']
            
            # Upload metadata
            metadata_collection.document(case_id).set(case_metadata)
            
            # Read and upload transcript
            transcript_filename = case_metadata['transcript_filename']
            transcript_path = os.path.join(transcripts_dir, transcript_filename)
            
            if os.path.exists(transcript_path):
                with open(transcript_path, 'r', encoding='utf-8') as file:
                    transcript_content = file.read()
                
                # Upload transcript with case_id as document ID
                transcripts_collection.document(case_id).set({
                    'case_id': case_id,
                    'content': transcript_content
                })
                
                success_count += 1
                print(f"Uploaded case {case_id} ({success_count}/{len(metadata_list)})")
            else:
                print(f"Transcript file not found for case {case_id}: {transcript_path}")
                error_count += 1
                
        except Exception as e:
            print(f"Error uploading case {case_id}: {e}")
            error_count += 1
    
    print(f"\nUpload complete: {success_count} successful, {error_count} errors")
    print(f"Metadata uploaded to collection: 'transcriptMetadata'")
    print(f"Transcripts uploaded to collection: 'transcripts'")

if __name__ == "__main__":
    upload_to_firebase()
    