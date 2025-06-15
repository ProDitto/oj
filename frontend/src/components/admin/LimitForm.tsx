import React, { useState } from 'react';
import type { Limits, Language } from '../../types';

interface LimitFormProps {
    limits: Limits[];
    setLimits: (limits: Limits[]) => void;
}

const languages: Language[] = ['python', 'cpp', 'java', 'javascript'];

const LimitForm: React.FC<LimitFormProps> = ({ limits, setLimits }) => {
    const [language, setLanguage] = useState<Language>('python');
    const [timeLimit, setTimeLimit] = useState(1000);
    const [memoryLimit, setMemoryLimit] = useState(256);

    const handleAddLimit = () => {
        const newLimit: Limits = {
            ProblemID: 0,
            Language: language,
            TimeLimitMS: timeLimit,
            MemoryLimitKB: memoryLimit,
        };
        setLimits([...limits, newLimit]);
        setLanguage('python'); // reset to default
        setTimeLimit(1000);
        setMemoryLimit(256);
    };

    const handleRemoveLimit = (index: number) => {
        const newLimits = [...limits];
        newLimits.splice(index, 1);
        setLimits(newLimits);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Problem Limits</h3>

            <div className="flex gap-4 items-end">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Language</label>
                    <select
                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                    >
                        {languages.map((lang) => (
                            <option key={lang} value={lang}>
                                {lang}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Time Limit (ms)</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Memory Limit (KB)</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                        value={memoryLimit}
                        onChange={(e) => setMemoryLimit(Number(e.target.value))}
                    />
                </div>
                <button
                    type="button"
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleAddLimit}
                >
                    Add Limit
                </button>
            </div>

            {limits.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time Limit</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Memory Limit</th>
                                <th className="px-3 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {limits.map((limit, index) => (
                                <tr key={index}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">{limit.Language}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">{limit.TimeLimitMS} ms</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">{limit.MemoryLimitKB} KB</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                                        <button
                                            type="button"
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => handleRemoveLimit(index)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LimitForm;
