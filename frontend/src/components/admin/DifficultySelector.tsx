import React from 'react';

interface DifficultySelectorProps {
    difficulty: string;
    setDifficulty: (difficulty: string) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ difficulty, setDifficulty }) => {
    return (
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Difficulty</h3>
            <select
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
            >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
        </div>
    );
};


export default DifficultySelector;
