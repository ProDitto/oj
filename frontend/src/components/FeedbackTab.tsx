import React, { useState } from 'react';
import { aiFeedback } from '../api/endpoints';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FeedbackTabProps {
    problemID: number;
    code: string;
}

const FeedbackTab: React.FC<FeedbackTabProps> = ({ problemID, code }) => {
    const [feedback, setFeedback] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false);

    const fetchFeedback = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await aiFeedback(problemID, code);
            setFeedback(res.data.Feedback || 'No feedback provided.');
        } catch (err) {
            console.error('Error fetching feedback:', err);
            setError('Unable to fetch feedback at this time. Please try again later.');
        } finally {
            setLoading(false);
            setHasFetched(true);
        }
    };

    // // Optional: Auto-fetch on mount if code exists
    // useEffect(() => {
    //     if (code && !hasFetched) {
    //         fetchFeedback();
    //     }
    // }, [code]);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">AI Feedback</h2>
                <button
                    onClick={fetchFeedback}
                    disabled={loading || !code}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? 'Fetching...' : 'Get Feedback'}
                </button>
            </div>

            {!code && (
                <p className="text-sm text-gray-500">
                    Please write some code in the Problem tab to receive feedback.
                </p>
            )}

            {error && (
                <div className="text-red-500 bg-red-100 p-3 rounded">
                    {error}
                </div>
            )}

            {feedback && (
                <div className="prose prose-sm sm:prose-base max-w-none bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{feedback}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default FeedbackTab;
