import React, { useState } from 'react';
import { db, doc, updateDoc, increment } from './firebaseConfig';

interface WordCardProps {
    word: string;
    userId: string;
    vetoUsed: boolean;
    onNext: () => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, userId, vetoUsed, onNext }) => {
    const [localVetoUsed, setLocalVetoUsed] = useState<boolean>(vetoUsed);

    const handleSort = async (category: string) => {
        const wordDocRef = doc(db, 'words', word);
        const pointsIncrement = category === 'epic' ? 10 : category === 'good' ? 5 : 0;

        await updateDoc(wordDocRef, {
            [category]: increment(1),
            points: increment(pointsIncrement)
        });
        onNext();
    };

    const handleVeto = async () => {
        setLocalVetoUsed(true);
        const userDocRef = doc(db, 'users', userId);
        const wordDocRef = doc(db, 'words', word);
        await updateDoc(userDocRef, { vetoUsed: true });
        await updateDoc(wordDocRef, { veto: increment(1) });
        onNext();
    };

    return (
        <div className="word-card">
            <h2>{word}</h2>
            <div className="button-container">
                <button className="epic" onClick={() => handleSort('epic')}>Epic</button>
                <button className="good" onClick={() => handleSort('good')}>Good</button>
                <button className="fail" onClick={() => handleSort('fail')}>Fail</button>
                <button className="veto" onClick={handleVeto} disabled={localVetoUsed}>Veto</button>
            </div>
        </div>
    );
};

export default WordCard;
