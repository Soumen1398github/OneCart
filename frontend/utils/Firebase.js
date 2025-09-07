// import {getAuth, GoogleAuthProvider} from "firebase/auth"
// import { initializeApp } from "firebase/app";
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_APIKEY ,
//   authDomain: "loginonecart.firebaseapp.com",
//   projectId: "loginonecart",
//   storageBucket: "loginonecart.firebasestorage.app",
//   messagingSenderId: "242165258894",
//   appId: "1:242165258894:web:0155a2ced93e20073247df"
// };
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app)
// const provider = new GoogleAuthProvider()


// export {auth , provider}



// Import the functions you need from the SDKs you need
import { getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "logincartify.firebaseapp.com",
  projectId: "logincartify",
  storageBucket: "logincartify.firebasestorage.app",
  messagingSenderId: "677792259155",
  appId: "1:677792259155:web:0ae1f70e0530434bbf7aa6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider};

