import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getContestById, runCode, submitSolution } from '../api/endpoints';
import type { Contest, ContestProblem, Language, RunCodePayload, Submission, SubmissionPayload } from '../types';
import Editor from '@monaco-editor/react';
import clsx from 'clsx';

const ContestProblemPage: React.FC = () => {
    const { contestId } = useParams<{ contestId: string }>();
    const [contest, setContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);
    // const [language, setLanguage] = useState<Language>('python');
    const [language] = useState<Language>('python');
    const [code, setCode] = useState<string>('');
    // const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [activeTab, setActiveTab] = useState(0); // 0 for Problems
    const [activeProblem, setActiveProblem] = useState<ContestProblem | null>(null);
    const [output, setOutput] = useState<string>('');
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submissionDetails, setSubmissionDetails] = useState<Submission | null>(null);
    const [problems, setProblems] = useState<ContestProblem[]>([]);

    useEffect(() => {
        console.log("Contest ID: ", contestId)
        const fetchContestDetails = async () => {
            if (!contestId) return;
            try {
                const contestResponse = await getContestById(contestId);
                setContest(contestResponse.data);
            } catch (error) {
                console.error("Error fetching contest details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContestDetails();
    }, [contestId]);

    // useEffect(() => {
    //     const fetchContestProblems = async () => {
    //         if (!contest) return;
    //         try {
    //             const problemsResponse = await getContestProblems(contest.ID);
    //             setProblems(problemsResponse.data);
    //             setActiveProblem(problemsResponse.data[0]); // Set the first problem as active by default
    //         } catch (error) {
    //             console.error("Error fetching contest problems", error);
    //         }
    //     };

    //     fetchContestProblems();
    // }, [contest]);

    const handleRun = async () => {
        if (!activeProblem) return;
        setRunning(true);
        const payload: RunCodePayload = {
            language,
            code,
            problemId: activeProblem.ID,
        };
        try {
            const response = await runCode(payload);
            // setOutput(response.data.output);
        } catch (error) {
            console.error("Error running code", error);
            setOutput('Error running code');
        } finally {
            setRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (!activeProblem) return;
        setSubmitting(true);
        const payload: SubmissionPayload = {
            language,
            code,
            problemId: activeProblem.ID,
        };
        try {
            const response = await submitSolution(payload);
            setSubmissionDetails(response.data);
        } catch (error) {
            console.error("Error submitting solution", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="p-6">Loading contest...</p>;
    if (!contest) return <p className="p-6 text-red-500">Contest not found.</p>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            <div className="flex space-x-4 border-b-2 pb-2">
                <button
                    className={clsx(
                        'tab px-6 py-2 font-medium text-sm rounded-lg transition-all duration-300',
                        activeTab === 0
                            ? 'border-b-4 border-blue-500 text-blue-500'
                            : 'hover:bg-gray-100 text-gray-700'
                    )}
                    onClick={() => setActiveTab(0)}
                >
                    Problems
                </button>
            </div>

            {activeTab === 0 && (
                <div>
                    <div className="flex space-x-4 mb-4">
                        {problems.map((problem) => (
                            <button
                                key={problem.ID}
                                className={clsx(
                                    'px-4 py-2 rounded-md text-sm font-medium transition-all duration-300',
                                    activeProblem?.ID === problem.ID
                                        ? 'bg-blue-500 text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                )}
                                onClick={() => setActiveProblem(problem)}
                            >
                                {problem.Title}
                            </button>
                        ))}
                    </div>

                    {activeProblem && (
                        <div>
                            <h2 className="text-2xl font-semibold">{activeProblem.Title}</h2>
                            <p className="text-gray-700 mt-2">{activeProblem.Description}</p>
                            <div className="mt-4">
                                <Editor
                                    height="400px"
                                    defaultLanguage={language}
                                    value={code}
                                    onChange={(e)=>setCode(e.target.value)}
                                />
                            </div>

                            <div className="mt-4 flex space-x-4">
                                <button
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                                    onClick={handleRun}
                                    disabled={running}
                                >
                                    {running ? 'Running...' : 'Run Code'}
                                </button>
                                <button
                                    className="px-6 py-2 bg-green-500 text-white rounded-lg"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Solution'}
                                </button>
                            </div>

                            {output && (
                                <div className="mt-4 p-4 border bg-gray-50 rounded-md">
                                    <h3 className="font-medium">Output:</h3>
                                    <pre>{output}</pre>
                                </div>
                            )}

                            {submissionDetails && (
                                <div className="mt-4 p-4 border bg-gray-50 rounded-md">
                                    <h3 className="font-medium">Submission Details:</h3>
                                    <p>Status: {submissionDetails.Status}</p>
                                    <p>Time: {submissionDetails.Time}</p>
                                    <p>Memory: {submissionDetails.Memory}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ContestProblemPage;
