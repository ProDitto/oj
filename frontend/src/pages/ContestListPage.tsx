import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getContests } from '../api/endpoints';
import type { Contest } from '../types';

const ContestListPage: React.FC = () => {
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getContests()
            .then((res) => setContests(res.data))
            .catch(() => setContests([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-6">Loading contests...</p>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            <h1 className="text-3xl font-bold">🏁 Contests</h1>

            {contests.length === 0 ? (
                <p className="text-gray-600">No contests found.</p>
            ) : (
                <ul className="space-y-4">
                    {contests.map((contest) => (
                        <li
                            key={contest.ID}
                            className="border rounded px-4 py-4 bg-white shadow-sm hover:bg-gray-50 transition"
                        >
                            <Link to={`/contest/${contest.ID}`} className="block">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-semibold text-blue-700 hover:underline">
                                        {contest.Name}
                                    </h2>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${contest.Status === 'ongoing'
                                            ? 'bg-green-100 text-green-700'
                                            : contest.Status === 'upcoming'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-200 text-gray-800'
                                        }`}>
                                        {contest.Status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-700">
                                    <span className="font-medium">Start:</span>{' '}
                                    {new Date(contest.StartTime).toLocaleString()}
                                    {' '}|{' '}
                                    <span className="font-medium">End:</span>{' '}
                                    {new Date(contest.EndTime).toLocaleString()}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ContestListPage;
