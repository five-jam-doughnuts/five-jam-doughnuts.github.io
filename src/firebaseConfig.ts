import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCdY157KRt8yWGTxKK7hEo8gfthuEVoAC0",
    authDomain: "c-words.firebaseapp.com",
    projectId: "c-words",
    storageBucket: "c-words.appspot.com",
    messagingSenderId: "713680351545",
    appId: "1:713680351545:web:83389e5b70f789cce7f8e8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const signIn = async () => {
    try {
        await signInAnonymously(auth);
        console.log('Signed in anonymously');
    } catch (error) {
        console.error('Error signing in anonymously', error);
    }
};

signIn();

export { db, collection, addDoc, doc, setDoc, getDoc };
