// Import the functions you need from the SDKs you need
import type { FirebaseApp } from "firebase/app";
import { initializeApp } from "firebase/app";// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiyvPS5HbaaTzEr_d7HtEkrLbmFMYuPbQ",
  authDomain: "mike-14f7b.firebaseapp.com",
  projectId: "mike-14f7b",
  storageBucket: "mike-14f7b.appspot.com",
  messagingSenderId: "598207532414",
  appId: "1:598207532414:web:f7f131d3d04376aa4d772f",
  measurementId: "G-H8NS4K6P07"
};

let app: FirebaseApp | null = null;

export const getFirebaseApp = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
};