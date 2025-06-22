import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import LanguageSelector from '../components/LanguageSelector';
import TestCaseEditor from '../components/TestCaseEditor';
import RunSubmitButtons from '../components/RunSubmitButtons';
import type { ProblemDetail, TestCase, Language, Submission } from '../types';
// import SubmissionResult from '../components/SubmissionResult';

type ProblemDetailsProps = {
  problem: ProblemDetail
  code: string
  setCode: (code: string) => void
  language: Language
  setLanguage: (language: Language) => void
  testCases: TestCase[]
  setTestCases: (tcs: TestCase[]) => void
  handleRun: () => void
  handleSubmit: () => void
  running: boolean
  submitting: boolean
  output: string
  submissionDetails: Submission | undefined
}

const ProblemDetails: React.FC<ProblemDetailsProps> = ({ problem, code, setCode, language, setLanguage, testCases, setTestCases, handleRun, handleSubmit, running, submitting, output, submissionDetails }) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">{problem?.Title}</h1>
        <div className="flex gap-2 text-sm text-gray-600 mt-2">
          <span className="bg-gray-200 px-2 py-0.5 rounded">Difficulty: {problem?.Difficulty}</span>
          {problem?.Tags?.map((tag) => (
            <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{tag}</span>
          ))}
        </div>

        <p className="text-gray-800 whitespace-pre-wrap mt-4">{problem?.Description}</p>
        <h2 className="font-semibold mt-4">Constraints:</h2>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {problem?.Constraints?.map((c, idx) => <li key={idx}>{c}</li>)}
        </ul>
      </div>

      <h2 className="font-semibold mt-4">Examples:</h2>
      <div className="space-y-4 pb-4">
        {problem?.Examples?.map((example, idx) => (
          <div key={example.ID} className="p-4 bg-gray-50 rounded border border-gray-200">
            <h3 className="font-semibold">Example {idx + 1}</h3>
            <div className="mt-2">
              <p><span className="font-medium">Input:</span></p>
              <pre className="bg-white p-2 rounded border overflow-auto">{example.Input}</pre>
            </div>
            <div className="mt-2">
              <p><span className="font-medium">Expected Output:</span></p>
              <pre className="bg-white p-2 rounded border overflow-auto">{example.ExpectedOutput}</pre>
            </div>
            {example.Explanation && (
              <div className="mt-2">
                <p><span className="font-medium">Explanation:</span></p>
                <pre className="bg-white p-2 rounded border overflow-auto">{example.Explanation}</pre>
              </div>
            )}
          </div>
        ))}
      </div>


      <div className="space-y-4">
        <LanguageSelector language={language} setLanguage={setLanguage} />

        <Editor
          height="400px"
          theme="vs-dark"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: 'on' }}
        />

        <TestCaseEditor
          testCases={testCases}
          activeTab={activeTab}
          setTestCases={setTestCases}
          setActiveTab={setActiveTab}
          testResults={submissionDetails?.Results}
        />

        <RunSubmitButtons
          handleRun={handleRun}
          handleSubmit={handleSubmit}
          running={running}
          submitting={submitting}
        />

        {output && (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <h3 className="font-medium mb-2">Output</h3>
            <pre className="whitespace-pre-wrap text-sm">{output}</pre>
          </div>
        )}

        {/* <SubmissionResult submissionDetails={submissionDetails} activeTab={activeTab} testCases={testCases} /> */}
      </div>
    </div>
  );
};

export default ProblemDetails;
