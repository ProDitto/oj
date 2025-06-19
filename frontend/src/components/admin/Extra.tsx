import { useState } from 'react'
import type { Language, ProblemExample } from '../../types';

export const ConstraintList: React.FC<{
  constraints: string[];
  setConstraints: (constraints: string[]) => void
}> = ({ constraints, setConstraints }) => {
  const [newConstraint, setNewConstraint] = useState('');

  const handleAddConstraint = () => {
    if (newConstraint.trim() && !constraints.includes(newConstraint.trim())) {
      setConstraints([...constraints, newConstraint.trim()]);
      setNewConstraint('');
    }
  };

  const handleRemoveConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Constraints</h3>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 border rounded-md shadow-sm"
          value={newConstraint}
          onChange={(e) => setNewConstraint(e.target.value)}
          placeholder="Add a constraint"
        />
        <button
          type="button"
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleAddConstraint}
        >
          Add
        </button>
      </div>

      <div className="mt-2 space-y-2">
        {constraints.map((constraint, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span>{constraint}</span>
            <button
              type="button"
              className="text-red-600 hover:text-red-800"
              onClick={() => handleRemoveConstraint(index)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// export const StatusSelector: React.FC<{
//   status: ProblemStatus;
//   setStatus: (status: ProblemStatus) => void;
// }> = ({ status, setStatus }) => {
//   return (
//     <div className="space-y-2">
//       <h3 className="text-sm font-medium text-gray-700">Status</h3>
//       <select
//         className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//         value={status}
//         onChange={(e) => setStatus(e.target.value as ProblemStatus)}
//       >
//         <option value="draft">Draft</option>
//         <option value="reviewed">Reviewed</option>
//         <option value="published">Published</option>
//       </select>
//     </div>
//   );
// };

export const SolutionEditor: React.FC<{
  language: Language;
  setLanguage: (language: Language) => void;
  solutionCode: string;
  setSolutionCode: (code: string) => void;
}> = ({ language, setLanguage, solutionCode, setSolutionCode }) => {
  const languages: Language[] = ['python', 'java', 'cpp', 'go', 'c'];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Solution</h3>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Solution Language</label>
          <select
            className="w-full px-3 py-2 border rounded-md shadow-sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Solution Code</label>
        <textarea
          className="w-full px-3 py-2 border rounded-md shadow-sm min-h-[200px] font-mono text-sm"
          value={solutionCode}
          onChange={(e) => setSolutionCode(e.target.value)}
          placeholder="Enter solution code"
        />
      </div>
    </div>
  );
};

// // Updated ProblemForm with all fields
// export const ProblemForm: React.FC = () => {
//   const { slug } = useParams<{ slug?: string }>();
//   const navigate = useNavigate();
//   const [problem, setProblem] = useState<ProblemDetail>({
//     ID: 0,
//     Title: '',
//     Description: '',
//     Constraints: [],
//     Slug: '',
//     Tags: [],
//     Difficulty: 'easy',
//     AuthorID: 1,
//     Status: 'draft',
//     SolutionLanguage: 'python',
//     SolutionCode: '',
//     TestCases: [],
//     Limits: [],
//     FailureReason: '',
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (slug) {
//       setIsLoading(true);
//       getProblemBySlug(slug)
//         .then(response => {
//           const p = response.data;
//           p.Tags = p.Tags || [];
//           p.Limits = p.Limits || [];
//           p.Constraints = p.Constraints || [];
//           setProblem(p);
//         })
//         .finally(() => setIsLoading(false));
//     }
//   }, [slug]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const action = slug ? updateProblem : createProblem;
//     try {
//       await action(problem);
//       navigate('/admin/problems');
//     } catch (error) {
//       console.error("Error submitting problem", error);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">{slug ? 'Edit Problem' : 'Create Problem'}</h1>

//       <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
//         {/* Problem Metadata */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h2>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//             <input
//               type="text"
//               className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               value={problem.Title}
//               onChange={(e) => setProblem({ ...problem, Title: e.target.value })}
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//             <textarea
//               className="w-full px-3 py-2 border rounded-md shadow-sm min-h-[150px] focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               value={problem.Description}
//               onChange={(e) => setProblem({ ...problem, Description: e.target.value })}
//               required
//             />
//           </div>
//         </div>

//         {/* Configuration */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Configuration</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <ConstraintList 
//               constraints={problem.Constraints} 
//               setConstraints={(constraints) => setProblem({ ...problem, Constraints: constraints })} 
//             />

//             <div className="space-y-6">
//               <TagSelector 
//                 tags={problem.Tags} 
//                 setTags={(tags) => setProblem({ ...problem, Tags: tags })} 
//               />

//               <DifficultySelector 
//                 difficulty={problem.Difficulty} 
//                 setDifficulty={(difficulty) => setProblem({ ...problem, Difficulty: difficulty })} 
//               />

//               <StatusSelector 
//                 status={problem.Status} 
//                 setStatus={(status) => setProblem({ ...problem, Status: status })} 
//               />
//             </div>
//           </div>
//         </div>

//         {/* Solution */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Solution</h2>
//           <SolutionEditor 
//             language={problem.SolutionLanguage} 
//             setLanguage={(lang) => setProblem({ ...problem, SolutionLanguage: lang })}
//             solutionCode={problem.SolutionCode}
//             setSolutionCode={(code) => setProblem({ ...problem, SolutionCode: code })}
//           />
//         </div>

//         {/* Test Cases */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Test Cases</h2>
//           <TestCaseForm 
//             testCases={problem.TestCases} 
//             setTestCases={(testCases) => setProblem({ ...problem, TestCases: testCases })} 
//           />
//         </div>

//         {/* Limits */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Execution Limits</h2>
//           <LimitForm 
//             limits={problem.Limits} 
//             setLimits={(limits) => setProblem({ ...problem, Limits: limits })} 
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end pt-4">
//           <button
//             type="submit"
//             className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
//               isLoading ? 'opacity-75 cursor-not-allowed' : ''
//             }`}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <span className="flex items-center">
//                 <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Saving...
//               </span>
//             ) : 'Save Problem'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// Updated TagSelector to be more robust
// export const TagSelector: React.FC<{
//   tags: string[]; 
//   setTags: (tags: string[]) => void
// }> = ({ tags, setTags }) => {
//   const [inputValue, setInputValue] = useState('');

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (['Enter', 'Tab', ','].includes(e.key)) {
//       e.preventDefault();
//       const newTag = inputValue.trim();
//       if (newTag && !tags.includes(newTag)) {
//         setTags([...tags, newTag]);
//         setInputValue('');
//       }
//     }
//   };

//   const removeTag = (index: number) => {
//     setTags(tags.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="space-y-2">
//       <h3 className="text-sm font-medium text-gray-700">Tags</h3>
//       <input
//         type="text"
//         className="w-full px-3 py-2 border rounded-md shadow-sm"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Enter tag and press comma/enter"
//       />

//       <div className="flex flex-wrap gap-2 mt-2">
//         {tags.map((tag, index) => (
//           <div key={index} className="bg-blue-100 text-blue-800 rounded-md px-2 py-1 flex items-center">
//             <span className="text-sm">{tag}</span>
//             <button
//               type="button"
//               className="ml-1 text-blue-500 hover:text-blue-700 font-bold"
//               onClick={() => removeTag(index)}
//             >
//               ×
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

export const ExampleForm: React.FC<{
  examples: ProblemExample[];
  setExamples: (examples: ProblemExample[]) => void;
}> = ({ examples, setExamples }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [explanation, setExplanation] = useState('');

  const handleAddExample = () => {
    const newExample: ProblemExample = {
      ID: Date.now(),
      Input: input,
      ExpectedOutput: output,
      Explanation: explanation
    };
    setExamples([...examples, newExample]);
    setInput('');
    setOutput('');
    setExplanation('');
  };

  const removeExample = (id: number) => {
    setExamples(examples.filter(ex => ex.ID !== id));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Examples</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Input</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md shadow-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example input"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Expected Output</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md shadow-sm"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Expected output"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Explanation (Optional)</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md shadow-sm"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explanation of example"
              rows={2}
            />
          </div>
        </div>

        <button
          type="button"
          className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleAddExample}
        >
          Add Example
        </button>
      </div>

      {examples.length > 0 && (
        <div className="border rounded-md divide-y mt-4">
          {examples.map((example) => (
            <div key={example.ID} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                  <div>
                    <p className="text-sm font-medium">Input:</p>
                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded font-mono">{example.Input}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Output:</p>
                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded font-mono">{example.ExpectedOutput}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Explanation:</p>
                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{example.Explanation || '-'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-4 text-red-600 hover:text-red-900"
                  onClick={() => removeExample(example.ID)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
