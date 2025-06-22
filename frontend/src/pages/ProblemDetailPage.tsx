import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  getProblemBySlug,
  runCode,
  getSubmission,
  getDiscussions,
  voteDiscussion,
  createDiscussion,
  updateDiscussion,
  submitSolution,
} from '../api/endpoints';
import type {
  ProblemDetail,
  Language,
  RunCodePayload,
  SubmissionPayload,
  TestCase,
  Submission,
  Discussion,
  // AddVotePayload,
} from '../types';
import DiscussionsTab from '../components/DiscussionsTab';
import ProblemDetails from '../components/ProblemDetails';
import FeedbackTab from '../components/FeedbackTab';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

const ProblemDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [activeTab, setActiveTab] = useState(0); // 0: Problem, 1: Discussions
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState<Submission | undefined>();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isDiscussionsLoading, setIsDiscussionsLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  const currentRunId = useRef<number>(0);

  useEffect(() => {
    if (!slug) return;

    const fetchProblemDetails = async () => {
      setLoading(true);
      try {
        const res = await getProblemBySlug(slug);
        const p: ProblemDetail = {
          ...res.data,
          Tags: res.data.Tags || [],
          Limits: res.data.Limits || [],
          Constraints: res.data.Constraints || [],
          Examples: res.data.Examples || [],
        };
        setProblem(p);
        setLanguage('python');
        setCode('');
        setTestCases(p.Examples);
      } catch (error) {
        console.error('Failed to fetch problem details', error);
        setProblem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemDetails();
  }, [slug]);

  useEffect(() => {
    const fetchDiscussions = async () => {
      if (!problem || activeTab !== 1) return;
      setIsDiscussionsLoading(true);
      try {
        const res = await getDiscussions(problem.ID);
        setDiscussions(res.data);
      } catch (error) {
        console.error('Error fetching discussions', error);
        setDiscussions([]);
      } finally {
        setIsDiscussionsLoading(false);
      }
    };

    fetchDiscussions();
  }, [problem, activeTab]);

  const pollForResults = useCallback(async (runId: number) => {
    currentRunId.current = runId;
    setRunning(true);

    let attempts = 0;
    const maxAttempts = 10;

    const intervalId = setInterval(async () => {
      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        setRunning(false);
        console.warn('Polling limit reached');
        return;
      }

      attempts++;

      try {
        const response = await getSubmission(runId);
        const result = response.data;

        if (!result.Results) {
          result.Results = [{
            ID: 1,
            Status: result.Status,
            Input: "",
            ExpectedOutput: "",
            Output: "",
            RuntimeMS: 0,
            MemoryKB: 0,
          }];
        }

        if (result && result.Status !== 'pending') {
          clearInterval(intervalId);
          currentRunId.current = 0;
          setRunning(false);
          setSubmissionDetails(result);
        }
      } catch (error) {
        toast("Maximum number of polling attempts reached. The result could not be retrieved.", {
          type: 'error',
          autoClose: 2000,
          position: 'bottom-right',
        })
        console.error('Error polling result:', error);
        clearInterval(intervalId);
        setRunning(false);
      }
    }, 3000);
  }, []);

  const handleRun = async () => {
    if (!problem) return;
    try {
      const payload: RunCodePayload = {
        ProblemID: problem.ID,
        Language: language,
        Code: code,
        Cases: testCases,
      };
      const res = await runCode(payload);
      pollForResults(res.data.run_id);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data || "unknown error", {
          type: 'error',
          autoClose: 2000,
          position: 'bottom-right',
        })
      }
      console.error('Error running code:', error);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;
    setSubmitting(true);
    try {
      const payload: SubmissionPayload = {
        ProblemID: problem.ID,
        Language: language,
        Code: code,
      };
      const res = await submitSolution(payload); // Assuming submitSolution returns same as runCode
      pollForResults(res.data.run_id);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data || "unknown error", {
          type: 'error',
          autoClose: 2000,
          position: 'bottom-right',
        })
      }
      console.error('Error submitting solution:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateDiscussion = async (newDiscussion: Discussion) => {
    try {
      const response = await createDiscussion({ ...newDiscussion, ID: problem?.ID ? problem.ID : 0 });
      setDiscussions(prev => prev ? [...prev, { ...newDiscussion, ID: response.data.id }] : [{ ...newDiscussion, ID: response.data.id },]);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data || "unknown error", {
          type: 'error',
          autoClose: 2000,
          position: 'bottom-right',
        })
      }
      console.error('Error creating discussion:', error);
    }
  };

  const handleUpdateDiscussion = async (updatedDiscussion: Discussion) => {
    try {
      await updateDiscussion(updatedDiscussion);
      setDiscussions(prev =>
        prev.map(d => (d.ID === updatedDiscussion.ID ? updatedDiscussion : d))
      );
    } catch (error) {
      console.error('Error updating discussion:', error);
    }
  };

  const handleVoteDiscussion = async (discussionId: number, voteType: number) => {
    try {
      await voteDiscussion({ DiscussionID: discussionId, Vote: voteType > 0 ? +1 : -1 });
      setDiscussions(prev =>
        prev.map(d =>
          d.ID === discussionId
            ? { ...d, Votes: d.Votes + (voteType > 0 ? 1 : -1) }
            : d
        )
      );
    } catch (error) {
      console.error('Error voting on discussion:', error);
    }
  };

  if (loading) return <p className="p-6">Loading problem...</p>;
  if (!problem) return <p className="p-6 text-red-500">Problem not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex space-x-4 border-b-2 pb-2">
        {['Problem', 'Discussions', 'Feedback'].map((label, idx) => (
          <button
            key={label}
            className={clsx(
              'tab px-6 py-2 font-medium text-sm rounded-lg transition-all duration-300',
              activeTab === idx
                ? 'border-b-4 border-blue-500 text-blue-500'
                : 'hover:bg-gray-100 text-gray-700'
            )}
            onClick={() => setActiveTab(idx)}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 0 ? (
        <ProblemDetails
          problem={problem}
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          testCases={testCases}
          setTestCases={setTestCases}
          handleRun={handleRun}
          handleSubmit={handleSubmit}
          running={running}
          submitting={submitting}
          output={output}
          submissionDetails={submissionDetails}
        />
      ) : activeTab === 1 ? (
        isDiscussionsLoading ? (
          <p>Loading discussions...</p>
        ) : (
          <DiscussionsTab
            discussions={discussions}
            onCreateDiscussion={handleCreateDiscussion}
            onUpdateDiscussion={handleUpdateDiscussion}
          // onVoteDiscussion={handleVoteDiscussion}
          />
        )
      ) : (
        <FeedbackTab problemID={problem.ID} code={code} feedback={feedback} setFeedback={setFeedback} />
      )}
    </div>
  );
};

export default ProblemDetailPage;
