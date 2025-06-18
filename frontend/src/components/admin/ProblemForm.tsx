import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetProblemBySlug, createProblem, updateProblem } from '../../api/endpoints';
import type { ProblemDetail } from '../../types';
import TagSelector from './TagSelector';
import DifficultySelector from './DifficultySelector';
import TestCaseForm from './TestCaseForm';
import LimitForm from './LimitForm';
import { ConstraintList, SolutionEditor, ExampleForm } from './Extra';

const ProblemForm: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<ProblemDetail>({
    ID: 0,
    Title: '',
    Description: '',
    Constraints: [],
    Slug: '',
    Tags: [],
    Difficulty: 'easy',
    AuthorID: 1,
    Status: 'draft',
    SolutionLanguage: 'python',
    SolutionCode: '',
    TestCases: [],
    Limits: [],
    FailureReason: '',
    Examples: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      adminGetProblemBySlug(slug)
        .then(response => {
          const p = response.data;
          p.Tags = p.Tags || [];
          p.Limits = p.Limits || [];
          p.Constraints = p.Constraints || [];
          p.Examples = p.Examples || [];
          setProblem(p);
        })
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = slug ? updateProblem : createProblem;
    try {
      await action(problem);
      navigate('/admin/problems');
    } catch (error) {
      console.error("Error submitting problem", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{slug ? 'Edit Problem' : 'Create Problem'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Problem Metadata */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={problem.Title}
              onChange={(e) => setProblem({ ...problem, Title: e.target.value })}
              required
            />
          </div>

          {/* Add Slug Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
              <span className="text-xs text-gray-500 ml-1">
                (URL-friendly identifier)
              </span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={problem.Slug}
              onChange={(e) => setProblem({ ...problem, Slug: e.target.value })}
              required
              pattern="[a-z0-9\-]+"
              title="Lowercase letters, numbers, and hyphens only"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md shadow-sm min-h-[150px] focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={problem.Description}
              onChange={(e) => setProblem({ ...problem, Description: e.target.value })}
              required
            />
          </div>
        </div>


        {/* Add Examples Form */}
        <ExampleForm
          examples={problem.Examples}
          setExamples={(examples) => setProblem({ ...problem, Examples: examples })}
        />

        {/* Configuration */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Configuration</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ConstraintList
              constraints={problem.Constraints}
              setConstraints={(constraints) => setProblem({ ...problem, Constraints: constraints })}
            />

            <div className="space-y-6">
              <TagSelector
                tags={problem.Tags}
                setTags={(tags) => setProblem({ ...problem, Tags: tags })}
              />

              <DifficultySelector
                difficulty={problem.Difficulty}
                setDifficulty={(difficulty) => setProblem({ ...problem, Difficulty: difficulty })}
              />

              {/* <StatusSelector
                status={problem.Status}
                setStatus={(status) => setProblem({ ...problem, Status: status })}
              /> */}
            </div>
          </div>
        </div>

        {/* Solution */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Solution</h2>
          <SolutionEditor
            language={problem.SolutionLanguage}
            setLanguage={(lang) => setProblem({ ...problem, SolutionLanguage: lang })}
            solutionCode={problem.SolutionCode}
            setSolutionCode={(code) => setProblem({ ...problem, SolutionCode: code })}
          />
        </div>

        {/* Test Cases */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Test Cases</h2>
          <TestCaseForm
            testCases={problem.TestCases}
            setTestCases={(testCases) => setProblem({ ...problem, TestCases: testCases })}
          />
        </div>

        {/* Limits */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Execution Limits</h2>
          <LimitForm
            limits={problem.Limits}
            setLimits={(limits) => setProblem({ ...problem, Limits: limits })}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : 'Save Problem'}
          </button>
        </div>
      </form>
    </div>
  );
};


export default ProblemForm;
