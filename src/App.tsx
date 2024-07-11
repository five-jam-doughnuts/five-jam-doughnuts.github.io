import React, { useState, useEffect } from 'react';
import { db, doc, getDoc } from './firebaseConfig';
import WordList from './WordList';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// https://coolors.co/d741a7-3a1772-5398be-f2cd5d-dea54b
import './App.css';

const App: React.FC = () => {
    const [words, setWords] = useState<string[]>([]);
    const [userId, setUserId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                await fetchWords();
                setLoading(false);
            } else {
                setLoading(false);
            }
        });
    }, []);

    const fetchWords = async () => {
        const docRef = doc(db, 'words', 'wordList');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const wordsArray = Object.values(data) as string[];
            setWords(wordsArray);
            console.log("Fetched words");
        } else {
            console.log('No such document!');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <h1 className="word">C Words</h1>
            <WordList words={words} userId={userId} />
        </div>
    );
};

export default App;
