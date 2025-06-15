import React from 'react';

const SubmissionResult: React.FC<any> = ({ submissionDetails, activeTab, testCases }) => (
    <div>
        {submissionDetails?.Results && (
            <div className="mt-6 bg-white border border-gray-300 p-4 rounded">
                <h3 className="font-semibold text-lg mb-4">Submission Result - Case #{activeTab + 1}</h3>

                {submissionDetails.Results[activeTab] ? (
                    <div className="space-y-3 text-sm text-gray-800">
                        <p><strong>Status:</strong> {submissionDetails.Results[activeTab].Status.toUpperCase()}</p>
                        <p><strong>Runtime:</strong> {submissionDetails.Results[activeTab].RuntimeMS} ms</p>
                        <p><strong>Memory:</strong> {submissionDetails.Results[activeTab].MemoryKB} KB</p>

                        <div>
                            <p className="font-semibold">Input</p>
                            <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap font-mono">{testCases[activeTab]?.Input}</pre>
                        </div>

                        <div>
                            <p className="font-semibold">Expected Output</p>
                            <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap font-mono">{testCases[activeTab]?.ExpectedOutput}</pre>
                        </div>

                        <div>
                            <p className="font-semibold">StdOut</p>
                            <pre className="bg-green-100 p-2 rounded whitespace-pre-wrap font-mono">{submissionDetails.Results[activeTab].StdOut || 'N/A'}</pre>
                        </div>

                        {submissionDetails.Results[activeTab].StdErr && (
                            <div>
                                <p className="font-semibold text-red-600">StdErr</p>
                                <pre className="bg-red-100 p-2 rounded whitespace-pre-wrap font-mono text-red-800">{submissionDetails.Results[activeTab].StdErr}</pre>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No result found for this case.</p>
                )}
            </div>
        )}
    </div>
);

export default SubmissionResult;
