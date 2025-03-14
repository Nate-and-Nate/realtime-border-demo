# Asylum AI Demo

A React web application demonstrating how AI can enhance asylum processing systems.

## Features

1. **Interview Summaries** - Generate concise summaries of asylum interview transcripts using AI
2. **Semantic Search** - Search across interview transcripts and summaries using natural language
3. **Discrepancy Analysis** - AI-powered comparison to find inconsistencies between interviews
4. **Priority Metrics** - Create custom qualitative prioritization metrics using natural language
5. **Background Checks** - Mock API for simulating safety and background checks with realistic probabilities

## Project Setup

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Firebase account (for Firestore)

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure Firebase:
   - Create a Firebase project
   - Enable Firestore
   - Add your Firebase configuration in `src/services/firebase.js`

4. Start the development server:
   ```
   npm start
   ```

### Data Structure

The application expects two collections in Firestore:

1. `transcriptMetadata` - Contains metadata about each asylum interview
2. `transcripts` - Contains the actual interview transcripts

## How It Works

### Interview Summaries
Uses AI to generate concise, structured summaries of lengthy asylum interview transcripts, extracting key claims, credibility factors, and relevant details.

### Semantic Search
Allows natural language searching across interviews and summaries to find relevant cases and patterns. This feature uses RAG (Retrieval-Augmented Generation) to ensure accurate and contextual results.

### Discrepancy Analysis
Compares multiple interviews from the same applicant to identify inconsistencies, categorized by severity and significance, to assist with credibility assessment.

### Priority Metrics
Create custom prioritization metrics using natural language descriptions (e.g., "Prioritize cases with STEM backgrounds and high vulnerability"). The AI generates a scoring function based on this description.

### Background Checks
Mock API for simulating background checks with realistic probability distributions based on country of origin, education level, and other factors.

## Implementation Notes

- The project uses React for the frontend
- Tailwind CSS for styling
- Firebase/Firestore for data storage
- Context API for state management
- RAG (Retrieval-Augmented Generation) for semantic search
- React Router for navigation

## Future Enhancements

- Integration with actual LLM APIs (OpenAI, Gemini)
- Implementation of real RAG for semantic search using embeddings
- User authentication and role-based access
- Case management workflows
- Enhanced visualization for trends and patterns

## License

MIT
