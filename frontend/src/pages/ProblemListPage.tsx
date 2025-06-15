import React, { useEffect, useState } from 'react';
import { getProblems } from '../api/endpoints';
import type { ProblemInfo } from '../types';
import { Link } from 'react-router-dom';

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
        case 'easy':
            return 'bg-green-100 text-green-800';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'hard':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const ProblemListPage: React.FC = () => {
    const [problems, setProblems] = useState<ProblemInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getProblems()
            .then((res) => setProblems(res.data))
            .catch(() => setError('Failed to load problems.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Problem List</h1>

            {loading && <p>Loading problems...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left">#</th>
                                <th className="px-4 py-3 text-left">Title</th>
                                <th className="px-4 py-3 text-left">Tags</th>
                                <th className="px-4 py-3 text-left">Difficulty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problems.map((problem) => (
                                <tr
                                    key={problem.ID}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-2">{problem.ID}</td>
                                    <td className="px-4 py-2 text-blue-600">
                                        <Link to={`/problem/${problem.Slug}`}>{problem.Title}</Link>
                                    </td>
                                    <td className="px-4 py-2 space-x-1">
                                        {problem.Tags?.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-block text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(problem.Difficulty)}`}
                                        >
                                            {problem.Difficulty}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {problems.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                                        No problems available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProblemListPage;
