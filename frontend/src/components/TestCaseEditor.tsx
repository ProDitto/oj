import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { TestCase, TestResult } from '../types';

interface TestCaseEditorProps {
    testCases: TestCase[];
    activeTab: number;
    setTestCases: (cases: TestCase[]) => void;
    setActiveTab: (index: number) => void;
    testResults?: TestResult[];
}

const TestCaseEditor: React.FC<TestCaseEditorProps> = ({
    testCases,
    activeTab,
    setTestCases,
    setActiveTab,
    testResults,
}) => {
    const [viewMode, setViewMode] = useState<'edit' | 'results'>('edit');

    const addTestCase = () => {
        const newTestCase: TestCase = {
            ID: 1,
            Input: '',
            ExpectedOutput: '',
        };
        const updatedTestCases = [...testCases, newTestCase];
        setTestCases(updatedTestCases);
        setActiveTab(updatedTestCases.length - 1);
    };

    const removeTestCase = (index: number) => {
        if (testCases.length <= 1) return;

        const updatedTestCases = testCases.filter((_, i) => i !== index);
        setTestCases(updatedTestCases);

        if (activeTab === index) {
            setActiveTab(Math.max(0, updatedTestCases.length - 1));
        } else if (activeTab > index) {
            setActiveTab(activeTab - 1);
        }
    };

    useEffect(() => {
        if (testResults) {
            setViewMode("results")
        }
    }, [testResults])

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Test Cases</h2>
                <div className="space-x-2">
                    <button
                        className={`px-3 py-1 rounded ${viewMode === 'edit' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setViewMode('edit')}
                    >
                        Edit
                    </button>
                    <button
                        className={`px-3 py-1 rounded ${viewMode === 'results' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setViewMode('results')}
                    >
                        Results
                    </button>
                </div>
            </div>

            {/* Tabs */}
            {(viewMode === 'edit' ? testCases : testResults)?.length > 0 && (
                <div className="mb-4 border-b border-gray-200">
                    <div className="flex flex-wrap gap-2">
                        {(viewMode === 'edit' ? testCases : testResults)?.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveTab(idx)}
                                className={`flex items-center px-3 py-2 rounded-t border-b-2 ${activeTab === idx
                                    ? 'border-blue-500 text-blue-600 font-medium'
                                    : 'border-transparent text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                Case {idx + 1}
                                {viewMode === 'edit' && testCases.length > 1 && (
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTestCase(idx);
                                        }}
                                        className="ml-2 text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Content */}
            {viewMode === 'edit' ? (
                testCases.length > 0 ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Input*</label>
                            <textarea
                                className="w-full p-3 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                value={testCases[activeTab]?.Input || ''}
                                onChange={(e) => {
                                    const updated = [...testCases];
                                    updated[activeTab].Input = e.target.value;
                                    setTestCases(updated);
                                }}
                                placeholder="Enter test input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Output*</label>
                            <textarea
                                className="w-full p-3 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                value={testCases[activeTab]?.ExpectedOutput || ''}
                                onChange={(e) => {
                                    const updated = [...testCases];
                                    updated[activeTab].ExpectedOutput = e.target.value;
                                    setTestCases(updated);
                                }}
                                placeholder="Enter expected output"
                                required
                            />
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 py-8 text-center">
                        <p className="text-gray-500 mb-3">No test cases added yet</p>
                        <button
                            type="button"
                            onClick={addTestCase}
                            className="text-blue-500 hover:text-blue-700 flex items-center justify-center mx-auto"
                        >
                            <Plus size={16} className="mr-1" />
                            Add a test case
                        </button>
                    </div>
                )
            ) : testResults && testResults.length > 0 ? (
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded border">
                        <p><strong>Status:</strong> {testResults[activeTab]?.Status}</p>
                        <p><strong>Runtime:</strong> {testResults[activeTab]?.RuntimeMS} ms</p>
                        <p><strong>Memory:</strong> {testResults[activeTab]?.MemoryKB} KB</p>

                        <div className="mt-3">
                            <p className="font-medium">StdOut:</p>
                            <pre className="bg-white border p-2 rounded text-sm whitespace-pre-wrap">{testResults[activeTab]?.StdOut}</pre>
                        </div>

                        {testResults[activeTab]?.StdErr && (
                            <div className="mt-3">
                                <p className="font-medium text-red-600">StdErr:</p>
                                <pre className="bg-red-100 border border-red-300 text-red-800 p-2 rounded text-sm whitespace-pre-wrap">
                                    {testResults[activeTab]?.StdErr}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">No test results available yet.</p>
            )}

            {/* Add Test Case button (only in edit mode) */}
            {viewMode === 'edit' && (
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={addTestCase}
                        className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1 text-sm transition duration-200"
                    >
                        <Plus size={16} className="mr-1" />
                        Add Test Case
                    </button>
                </div>
            )}
        </div>
    );
};

export default TestCaseEditor;
