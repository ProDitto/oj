import React, { useState, useEffect } from 'react';
import type { Limits, Language } from '../../types';

export type Language = 'python' | 'cpp' | 'java' | 'go' | 'c';

const languages: Language[] = ['python', 'cpp', 'java', 'go', 'c'];

const TIME_RATIOS: Record<Language, number> = {
    cpp: 1,
    java: 2,
    python: 10,
    go: 1.5,
    c: 1.2,
};

const MEMORY_RATIOS: Record<Language, number> = {
    cpp: 1,
    java: 2.5,
    python: 4,
    go: 2,
    c: 1.1,
};


interface LimitFormProps {
    limits: Limits[];
    setLimits: (limits: Limits[]) => void;
}

const LimitForm: React.FC<LimitFormProps> = ({ limits, setLimits }) => {
    const [overrides, setOverrides] = useState<Record<Language, { time: boolean; memory: boolean }>>(
        Object.fromEntries(languages.map((lang) => [lang, { time: false, memory: false }]))
    );

    // Helper to compute base values
    const getBase = (field: 'TimeLimitMS' | 'MemoryLimitKB', ratios: Record<Language, number>) => {
        for (const lang of languages) {
            if (!overrides[lang][field === 'TimeLimitMS' ? 'time' : 'memory']) {
                const baseValue = limits.find((l) => l.Language === lang)?.[field];
                if (baseValue != null) {
                    const ratio = ratios[lang];
                    return baseValue / ratio;
                }
            }
        }
        return field === 'TimeLimitMS' ? 1000 : 256; // fallback
    };

    const updateField = (
        changedLang: Language,
        field: 'TimeLimitMS' | 'MemoryLimitKB',
        value: number
    ) => {
        const isTime = field === 'TimeLimitMS';
        const ratios = isTime ? TIME_RATIOS : MEMORY_RATIOS;
        const newOverrides = { ...overrides, [changedLang]: { ...overrides[changedLang], [isTime ? 'time' : 'memory']: true } };

        const base = value / ratios[changedLang];

        const updated = limits.map((limit) => {
            const lang = limit.Language;
            if (lang === changedLang || newOverrides[lang][isTime ? 'time' : 'memory']) return limit;

            return {
                ...limit,
                [field]: Math.round(base * ratios[lang]),
            };
        });

        const modified = updated.map((limit) =>
            limit.Language === changedLang ? { ...limit, [field]: value } : limit
        );

        setOverrides(newOverrides);
        setLimits(modified);
    };

    useEffect(() => {
        // Initialize all values using default ratios
        const baseTime = 1000;
        const baseMemory = 256;

        const initialLimits = languages.map((lang) => ({
            ProblemID: 0,
            Language: lang,
            TimeLimitMS: Math.round(baseTime * TIME_RATIOS[lang]),
            MemoryLimitKB: Math.round(baseMemory * MEMORY_RATIOS[lang]),
        }));

        setLimits(initialLimits);
    }, []);

    return (
        <div className="space-y-6">
            <h3 className="text-sm font-medium text-gray-700">Problem Limits (Auto-Ratio Based)</h3>

            <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time Limit (ms)</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Memory Limit (KB)</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Overrides</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {limits.map((limit) => (
                            <tr key={limit.Language}>
                                <td className="px-3 py-2 text-sm">{limit.Language}</td>
                                <td className="px-3 py-2 text-sm">
                                    <input
                                        type="number"
                                        className="w-24 px-2 py-1 border rounded"
                                        value={limit.TimeLimitMS}
                                        onChange={(e) =>
                                            updateField(limit.Language, 'TimeLimitMS', Number(e.target.value))
                                        }
                                    />
                                </td>
                                <td className="px-3 py-2 text-sm">
                                    <input
                                        type="number"
                                        className="w-24 px-2 py-1 border rounded"
                                        value={limit.MemoryLimitKB}
                                        onChange={(e) =>
                                            updateField(limit.Language, 'MemoryLimitKB', Number(e.target.value))
                                        }
                                    />
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-500">
                                    {overrides[limit.Language].time ? '⏱ ' : ''}
                                    {overrides[limit.Language].memory ? '💾' : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LimitForm;
