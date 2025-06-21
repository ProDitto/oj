import React, { useState } from 'react';
import type { TestCase } from '../../types';

interface TestCaseFormProps {
    testCases: TestCase[];
    setTestCases: (testCases: TestCase[]) => void;
}

const TestCaseForm: React.FC<TestCaseFormProps> = ({ testCases, setTestCases }) => {
    const [input, setInput] = useState('');
    const [expectedOutput, setExpectedOutput] = useState('');

    const handleAddTestCase = () => {
        const newTestCase: TestCase = {
            ID: Date.now(),
            Input: input,
            ExpectedOutput: expectedOutput,
        };
        setTestCases([...testCases, newTestCase]);
        setInput('');
        setExpectedOutput('');
    };

    const removeTestCase = (id: number) => {
        setTestCases(testCases.filter(tc => tc.ID !== id));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Test Cases</h3>

            <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Input</label>
                    <textarea
                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Test input"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Expected Output</label>
                    <textarea
                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                        value={expectedOutput}
                        onChange={(e) => setExpectedOutput(e.target.value)}
                        placeholder="Expected output"
                    />
                </div>
            </div>

            <button
                type="button"
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleAddTestCase}
            >
                Add Test Case
            </button>

            {testCases.length > 0 && (
                <div className="border rounded-md divide-y">
                    {testCases.map((testCase) => (
                        <div key={testCase.ID} className="p-4 hover:bg-gray-50 flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium">Input:</p>
                                <p className="text-sm mt-1 p-2 bg-gray-50 rounded font-mono">{testCase.Input}</p>
                                <p className="text-sm font-medium mt-3">Expected Output:</p>
                                <p className="text-sm mt-1 p-2 bg-gray-50 rounded font-mono">{testCase.ExpectedOutput}</p>
                            </div>
                            <button
                                type="button"
                                className="text-red-600 hover:text-red-900"
                                onClick={() => removeTestCase(testCase.ID)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export default TestCaseForm;
