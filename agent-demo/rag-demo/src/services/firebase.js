// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, query, where, limit, orderBy } from "firebase/firestore";

// Your web app's Firebase configuration
// For a demo, you would replace this with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDe8kFbFqiF8ebXQvhXpVGPGTT6kfe_0ts",
  authDomain: "border-demo-70326.firebaseapp.com",
  projectId: "border-demo-70326",
  storageBucket: "border-demo-70326.firebasestorage.app",
  messagingSenderId: "805199937812",
  appId: "1:805199937812:web:9f0c1542e8edc7a7bf8201",
  measurementId: "G-KYJDMDE02W"
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
