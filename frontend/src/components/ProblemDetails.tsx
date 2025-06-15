import React from 'react';
import { Editor } from '@monaco-editor/react';
import LanguageSelector from '../components/LanguageSelector';
import TestCaseEditor from '../components/TestCaseEditor';
import RunSubmitButtons from '../components/RunSubmitButtons';
import SubmissionResult from '../components/SubmissionResult';

const ProblemDetails: React.FC<any> = ({ problem, code, setCode, language, setLanguage, testCases, setTestCases, activeTab, setActiveTab, handleRun, handleSubmit, running, submitting, output, submissionDetails }) => {
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

        <SubmissionResult submissionDetails={submissionDetails} activeTab={activeTab} testCases={testCases} />
      </div>
    </div>
  );
};

export default ProblemDetails;
