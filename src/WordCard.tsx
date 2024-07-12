import React, { useState } from 'react';
import { db, addDoc, collection } from './firebaseConfig';

interface WordCardProps {
    word: string;
    userId: string;
    onNext: () => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, userId, onNext }) => {
    const [hasVetoed, setVetoed] = useState<boolean>(false);

    const handleSort = async (category: string) => {
        await addDoc(collection(db, 'responses'), {
            word,
            userId,
            category,
            vetoed: false
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
            <h2>{word}</h2>
            <div className="button-container">
                <button className="epic" onClick={() => handleSort('epic')}>Epic</button>
                <button className="good" onClick={() => handleSort('good')}>Good</button>
                <button className="fail" onClick={() => handleSort('fail')}>Fail</button>
                <button className="veto" onClick={handleVeto} disabled={hasVetoed}>Veto</button>
            </div>
        </div>
    );
};

export default WordCard;
