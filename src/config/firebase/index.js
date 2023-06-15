// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8US27GpFZKy7wxOyFp3SUizM0EmhahQE",
  authDomain: "astraapp-7ce22.firebaseapp.com",
  databaseURL: "https://astraapp-7ce22-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "astraapp-7ce22",
  storageBucket: "astraapp-7ce22.appspot.com",
  messagingSenderId: "444114344475",
  appId: "1:444114344475:web:103ebb209f4a0afbdeb6be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;