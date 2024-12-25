import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyANVAMkmDCvVYVH8AkoPW4Xx1i0pQSTklE",
   authDomain: "bookingtickets-68209.firebaseapp.com",
   projectId: "bookingtickets-68209",
   storageBucket: "bookingtickets-68209.firebasestorage.app",
   messagingSenderId: "1099455408317",
   appId: "1:1099455408317:web:b389c001b7fb666a28efd4",
   measurementId: "G-S0GS4MK9KM",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
