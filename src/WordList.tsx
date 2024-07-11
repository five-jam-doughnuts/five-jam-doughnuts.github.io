import React, { useState } from 'react';
import WordCard from './WordCard';

interface WordListProps {
    words: string[];
    userId: string;
}

const WordList: React.FC<WordListProps> = ({ words, userId }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const handleNext = () => {
        setCurrentIndex(currentIndex + 1);
    };

    if (currentIndex >= words.length) {
        return <h2>All words sorted!</h2>;
    }

    return (
        <div className="word-list">
            <WordCard word={words[currentIndex]} userId={userId} onNext={handleNext} />
        </div>
    );
};

export default WordList;
