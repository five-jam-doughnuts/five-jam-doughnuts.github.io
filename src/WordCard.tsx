import React, { useState } from 'react';
import { db, addDoc, collection } from './firebaseConfig';

interface WordCardProps {
    word: string;
    userId: string;
    onNext: () => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, userId, onNext }) => {
    const [vetoed, setVetoed] = useState<boolean>(false);

    const handleSort = async (category: string) => {
        await addDoc(collection(db, 'responses'), {
            word,
            userId,
            category,
            vetoed
        });
        onNext();
    };

    const handleVeto = async () => {
        setVetoed(true);
        await addDoc(collection(db, 'responses'), {
            word,
            userId,
            category: null,
            vetoed: true
        });
        onNext();
    };

    return (
        <div className="word-card">
            <h3>{word}</h3>
            <button onClick={() => handleSort('epic')} disabled={vetoed}>Epic</button>
            <button onClick={() => handleSort('good')} disabled={vetoed}>Good</button>
            <button onClick={() => handleSort('fail')} disabled={vetoed}>Fail</button>
            <button onClick={handleVeto} disabled={vetoed}>Veto</button>
        </div>
    );
};

export default WordCard;
