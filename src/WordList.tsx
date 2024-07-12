import React, { useState, useEffect } from 'react';
import { db, doc, updateDoc, getDoc, arrayRemove, collection, getDocs } from './firebaseConfig';
import WordCard from './WordCard';

interface WordListProps {
    userId: string;
}

const WordList: React.FC<WordListProps> = ({ userId }) => {
    const [totalWords, setTotalWords] = useState<string[]>([]);
    const [userWords, setUserWords] = useState<string[]>([]);
    const [vetoUsed, setVetoUsed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

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

    const handleNext = async (currentWord: string) => {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
            words: arrayRemove(currentWord)
        });

        const updatedUserDoc = await getDoc(userDocRef);
        if (updatedUserDoc.exists()) {
            setUserWords(updatedUserDoc.data().words);
            setVetoUsed(updatedUserDoc.data().vetoUsed || false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (userWords.length === 0) {
        return <h2>All words sorted!</h2>;
    }

    const currentIndex = totalWords.length - userWords.length;

    return (
        <div className="word-list">
            <WordCard word={userWords[0]} userId={userId} vetoUsed={vetoUsed} onNext={() => handleNext(userWords[0])} />
            <h2>{currentIndex + 1} / {totalWords.length}</h2>
        </div>
    );
};

export default WordList;
