import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebaseConfig';
import WordList from './WordList';
import Results from './Results';
import './styles.css'; // Import the CSS file

const App: React.FC = () => {
    const [userId, setUserId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeUser = async (userId: string) => {
            const userDocRef = doc(db, 'users', userId);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                const wordsCollectionRef = collection(db, 'words');
                const wordsSnapshot = await getDocs(wordsCollectionRef);
                const wordsData = wordsSnapshot.docs.map(doc => doc.id);

                await setDoc(userDocRef, { words: wordsData, vetoUsed: false });
            }

            setLoading(false);
        };

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                await initializeUser(user.uid);
            } else {
                setLoading(false);
            }
        });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <div className="App">
                        <h1>C Words</h1>
                        <WordList userId={userId} />
                    </div>
                } />
                <Route path="/results" element={
                    <div className="App">
                        <h1>Results</h1>
                        <Results />
                    </div>
                } />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
