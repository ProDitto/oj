import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getContestById } from '../api/endpoints';
import type { Contest } from '../types';

const ContestDetailPage: React.FC = () => {
    const { contestId } = useParams<{ contestId: string }>();
    const [contest, setContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contestId) return;
        getContestById(Number(contestId))
            .then((res) => setContest(res.data))
            .catch(() => setContest(null))
            .finally(() => setLoading(false));
    }, [contestId]);

    if (loading) return <p className="p-6">Loading contest details...</p>;
    if (!contest) return <p className="p-6 text-red-500">Contest not found.</p>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            {/* Contest Header */}
            <div>
                <h1 className="text-3xl font-bold">{contest.Name}</h1>
                <div className="text-sm text-gray-600 mt-2 space-x-2">
                    <span className={`inline-block px-2 py-0.5 rounded ${contest.Status === 'ongoing'
                        ? 'bg-green-100 text-green-700'
                        : contest.Status === 'upcoming'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-200 text-gray-800'
                        }`}>
                        Status: {contest.Status}
                    </span>
                    <span className="text-gray-700">
                        {new Date(contest.StartTime).toLocaleString()} — {new Date(contest.EndTime).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Problems Section */}
            <div>
                <h2 className="text-xl font-semibold mb-3">🧩 Problems</h2>
                <ul className="space-y-2">
                    {contest.Problems?.map((problem) => (
                        <li
                            key={problem.ID}
                            className="border rounded px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50"
                        >
                            <div>
                                <Link to={`/contest/${contestId}/problem/${problem.Slug}`} className="text-blue-600 hover:underline text-lg font-medium">
                                    {problem.Title}
                                </Link>
                                <div className="text-sm text-gray-600 flex gap-2 mt-1">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                        {problem.Difficulty}
                                    </span>
                                    {problem.Tags?.map((tag) => (
                                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-gray-800">
                                {problem.MaxPoints} pts
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Leaderboard Section */}
            <div>
                <h2 className="text-xl font-semibold mb-3">🏆 Leaderboard</h2>
                <div className="border rounded overflow-hidden">
                    <table className="w-full text-sm table-auto border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left px-4 py-2">#</th>
                                <th className="text-left px-4 py-2">Username</th>
                                <th className="text-left px-4 py-2">Score</th>
                                <th className="text-left px-4 py-2">Rating Δ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contest.Leaderboard?.map((participant, idx) => (
                                <tr
                                    key={participant.UserID}
                                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                >
                                    <td className="px-4 py-2 font-medium text-gray-700">{idx + 1}</td>
                                    <td className="px-4 py-2 text-blue-600">{participant.Username}</td>
                                    <td className="px-4 py-2 text-gray-800">{participant.Score}</td>
                                    <td className={`px-4 py-2 font-semibold ${participant.RatingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {participant.RatingChange >= 0 ? `+${participant.RatingChange}` : participant.RatingChange}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ContestDetailPage;
