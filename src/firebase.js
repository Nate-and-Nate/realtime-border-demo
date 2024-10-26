// Initialize Firebase (add to your existing initialization)
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDe8kFbFqiF8ebXQvhXpVGPGTT6kfe_0ts",
    authDomain: "border-demo-70326.firebaseapp.com",
    projectId: "border-demo-70326",
    storageBucket: "border-demo-70326.appspot.com",
    messagingSenderId: "805199937812",
    appId: "1:805199937812:web:9f0c1542e8edc7a7bf8201",
    measurementId: "G-KYJDMDE02W"
  };
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function 1: Create a new form
export async function createForm() {
  const timestamp = Date.now();
  const formId = `form_${timestamp}`;
  const formRef = doc(collection(db, 'forms'), formId);
  
  await setDoc(formRef, {
    created: timestamp,
    // Initialize empty fields
    name: '',
    age: '',
    origin: '',
    reason: '',
    entryPoint: '',
    travelCompanions: '',
    healthConditions: '',
    seekingAsylum: '',
    previousAttempts: '',
    // Add more fields as needed
  });
  
  return formId;
}

// Function 2: Update form fields
export async function updateForm(formId, updates) {
  const formRef = doc(collection(db, 'forms'), formId);
  await updateDoc(formRef, updates);
  return true;
}

// Function 3: Screen migrant against database
export async function screenMigrant(name, age) {
  const dangerousRef = collection(db, 'dangerousPeople');
  const q = query(
    dangerousRef,
    where('name', '==', name),
    where('age', '==', parseInt(age))
  );
  
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  }
  
  // Return the first matching record
  return querySnapshot.docs[0].data();
}

// Seed data for dangerous people (run once)
export async function seedDangerousData() {
  const dangerousRef = collection(db, 'dangerousPeople');
  const sampleData = [
    { name: 'John Smith', age: 35, threat: 'high', warrants: ['theft', 'assault'], lastSeen: 'Mexico City' },
    { name: 'Maria Rodriguez', age: 42, threat: 'medium', warrants: ['fraud'], lastSeen: 'Guatemala' },
    { name: 'Carlos Mendez', age: 28, threat: 'high', warrants: ['trafficking'], lastSeen: 'El Salvador' },
    // Add more sample data as needed
  ];
  
  for (const data of sampleData) {
    await setDoc(doc(dangerousRef), data);
  }
  return true;
}
