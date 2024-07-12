import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';

const Results: React.FC = () => {
    const [words, setWords] = useState<{ word: string; points: number }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchWords = async () => {
            const wordsCollectionRef = collection(db, 'words');
            const q = query(wordsCollectionRef, orderBy('points', 'desc'));
            const wordsSnapshot = await getDocs(q);
            const wordsData = wordsSnapshot.docs.map(doc => ({
                word: doc.id,
                points: doc.data().points
            }));
            setWords(wordsData);
            setLoading(false);
        };

        fetchWords();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ol>
            {words.map((word) => (
                <li key={word.word}>
                    {word.word}: {word.points} points
                </li>
            ))}
        </ol>
    );
};

export default Results;
