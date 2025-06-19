import React from 'react';

const languageOptions = ['python', 'cpp', 'java', 'go', 'c'];

const LanguageSelector: React.FC<any> = ({ language, setLanguage }) => (
    <div className="flex justify-between items-center">
        <label htmlFor="language" className="font-medium">Language:</label>
        <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
            {languageOptions.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
            ))}
        </select>
    </div>
);

export default LanguageSelector;
