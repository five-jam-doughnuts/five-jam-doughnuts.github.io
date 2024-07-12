import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc, arrayRemove, collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import WordCard from './WordCard';

interface WordListProps {
    userId: string;
}

const WordList: React.FC<WordListProps> = ({ userId }) => {
    const [totalWords, setTotalWords] = useState<string[]>([]);
    const [userWords, setUserWords] = useState<string[]>([]);
    const [vetoUsed, setVetoUsed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWords = async () => {
            const wordsCollectionRef = collection(db, 'words');
            const wordsSnapshot = await getDocs(wordsCollectionRef);
            const wordsData = wordsSnapshot.docs.map(doc => doc.id);
            setTotalWords(wordsData);

            const userDocRef = doc(db, 'users', userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                setUserWords(userDocSnap.data().words);
                setVetoUsed(userDocSnap.data().vetoUsed || false);
            }

            setLoading(false);
        };

        fetchWords();
    }, [userId]);

    const handleNext = async (currentWord: string, enableButtons: () => void) => {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
            words: arrayRemove(currentWord)
        });

        const updatedUserDoc = await getDoc(userDocRef);
        if (updatedUserDoc.exists()) {
            setUserWords(updatedUserDoc.data().words);
            setVetoUsed(updatedUserDoc.data().vetoUsed || false);
            enableButtons();
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (userWords.length === 0) {
        navigate('/results');
        return null;
    }

    const currentIndex = totalWords.length - userWords.length;

    return (
        <div className="word-list">
            <WordCard word={userWords[0]} userId={userId} vetoUsed={vetoUsed} onNext={(currentWord, enableButtons) => handleNext(currentWord, enableButtons)} />
            <h2>{currentIndex} / {totalWords.length}</h2>
        </div>
    );
};

export default WordList;
