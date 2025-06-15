import React, { useState } from 'react';

interface TagSelectorProps {
    tags: string[];
    setTags: (tags: string[]) => void;
}

const TagSelector: React.FC<{
    tags: string[];
    setTags: (tags: string[]) => void
}> = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (['Enter', 'Tab', ','].includes(e.key)) {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
                setInputValue('');
            }
        }
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Tags</h3>
            <input
                type="text"
                className="w-full px-3 py-2 border rounded-md shadow-sm"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter tag and press comma/enter"
            />

            <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 rounded-md px-2 py-1 flex items-center">
                        <span className="text-sm">{tag}</span>
                        <button
                            type="button"
                            className="ml-1 text-blue-500 hover:text-blue-700 font-bold"
                            onClick={() => removeTag(index)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TagSelector;
