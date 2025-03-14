// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, query, where, limit, orderBy } from "firebase/firestore";

// Your web app's Firebase configuration
// For a demo, you would replace this with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collections references
const transcriptsCollection = collection(db, "transcripts");
const metadataCollection = collection(db, "transcriptMetadata");

// Functions to fetch data
export const getAllMetadata = async () => {
  const snapshot = await getDocs(metadataCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getMetadataById = async (caseId) => {
  const q = query(metadataCollection, where("case_id", "==", caseId), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

export const getTranscriptById = async (caseId) => {
  const q = query(transcriptsCollection, where("case_id", "==", caseId), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

export const getMetadataByField = async (field, value) => {
  const q = query(metadataCollection, where(field, "==", value));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getRecentCases = async (count = 10) => {
  const q = query(metadataCollection, orderBy("interview_date", "desc"), limit(count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getFilteredCases = async (filters) => {
  let q = query(metadataCollection);
  
  Object.entries(filters).forEach(([field, value]) => {
    if (value) {
      q = query(q, where(field, "==", value));
    }
  });
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export default db;
