// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDr4h8ypAaXyCBid_NnbrxHSFSKTA2fGpI',
  authDomain: 'art-toys.firebaseapp.com',
  projectId: 'art-toys',
  storageBucket: 'art-toys.appspot.com',
  messagingSenderId: '758717001331',
  appId: '1:758717001331:web:5f9e5d81550e369e50c406',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
