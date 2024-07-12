import React, { useState } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebaseConfig';

interface WordCardProps {
    word: string;
    userId: string;
    vetoUsed: boolean;
    onNext: (currentWord: string, enableButtons: () => void) => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, userId, vetoUsed, onNext }) => {
    const [localVetoUsed, setLocalVetoUsed] = useState<boolean>(vetoUsed);
    const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false);

    const enableButtons = () => {
        setButtonsDisabled(false);
    };

    const handleSort = async (category: string) => {
        setButtonsDisabled(true); // Disable buttons to prevent multiple clicks
        const wordDocRef = doc(db, 'words', word);
        const pointsIncrement = category === 'epic' ? 10 : category === 'good' ? 5 : 0;

        await updateDoc(wordDocRef, {
            [category]: increment(1),
            points: increment(pointsIncrement)
        });
        onNext(word, enableButtons);
    };

    const handleVeto = async () => {
        setLocalVetoUsed(true);
        setButtonsDisabled(true); // Disable buttons to prevent multiple clicks
        const userDocRef = doc(db, 'users', userId);
        const wordDocRef = doc(db, 'words', word);
        await updateDoc(userDocRef, { vetoUsed: true });
        await updateDoc(wordDocRef, { veto: increment(1) });
        onNext(word, enableButtons);
    };

    return (
        <div className="word-card">
            <h2>{word}</h2>
            <div className="button-container">
                <button className="epic" onClick={() => handleSort('epic')} disabled={buttonsDisabled}>Epic</button>
                <button className="good" onClick={() => handleSort('good')} disabled={buttonsDisabled}>Good</button>
                <button className="fail" onClick={() => handleSort('fail')} disabled={buttonsDisabled}>Fail</button>
                <button className="veto" onClick={handleVeto} disabled={localVetoUsed || buttonsDisabled}>Veto</button>
            </div>
        </div>
    );
};

export default WordCard;
