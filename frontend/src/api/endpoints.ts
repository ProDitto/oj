// src/api/endpoints.ts
import axios from './axios';
import type {
    SignupPayload,
    LoginPayload,
    OkResponse,
    IdResponse,
    User,
    ProblemInfo,
    ProblemDetail,
    SubmissionPayload,
    Submission,
    RunCodePayload,
    Contest,
    ContestParticipant,
    Discussion,
    AddVotePayload,
} from '../types';

// Auth
export const signup = (data: SignupPayload) =>
    axios.post<OkResponse>('/signup', data);

export const login = (data: LoginPayload) =>
    axios.post<OkResponse>('/login', data);

export const logout = () =>
    axios.post<OkResponse>('/logout');

// Profile
export const getCurrentUser = () =>
    axios.get<User>(`/me`);

export const getProfile = (username: string) =>
    axios.get<User>(`/profile/${username}`);

// Problems
export const getProblems = () =>
    axios.get<ProblemInfo[]>('/problems');

export const adminGetProblems = () =>
    axios.get<ProblemInfo[]>('/problem-list');

export const createProblem = (data: ProblemDetail) =>
    axios.post<IdResponse>('/problems', data);

// TODO: Remove/Update this
export const deleteProblem = (data: ProblemDetail) =>
    axios.post<IdResponse>('/problems', data);

export const getProblemBySlug = (slug: string) =>
    axios.get<ProblemDetail>(`/problem/${slug}`);

export const adminGetProblemBySlug = (slug: string) =>
    axios.get<ProblemDetail>(`/problem-list/${slug}`);

export const updateProblem = (data: ProblemDetail) =>
    axios.put<OkResponse>(`/problems/${data.ID}`, data);

// Submissions
export const submitSolution = (data: SubmissionPayload) =>
    axios.post<IdResponse>('/submit', data);

export const getSubmissions = (problemID: number) =>
    axios.get<Submission[]>(`/submissions/${problemID}`);

export const getSubmission = (runID: number) =>
    axios.get<Submission>(`/submission/${runID}`);

export const runCode = (data: RunCodePayload) =>
    axios.post<IdResponse>('/run', data);

// Contests
export const getContests = () =>
    axios.get<Contest[]>('/contests');

export const createContest = (data: Contest) =>
    axios.post<IdResponse>('/contests', data);

export const getContestById = (id: number) =>
    axios.get<Contest>(`/contest/${id}`);

export const updateContest = (id: number, data: Contest) =>
    axios.put<OkResponse>(`/contest/${id}`, data);

export const getContestLeaderboard = (id: number) =>
    axios.get<ContestParticipant[]>(`/contest/${id}/leaderboard`);

export const startContest = (id: number) =>
    axios.post<OkResponse>(`/contest/${id}/start`);

export const endContest = (id: number) =>
    axios.post<OkResponse>(`/contest/${id}/end`);

export const joinContest = (id: number) =>
    axios.post<OkResponse>(`/contest/${id}/join`);

// Discussions
export const getDiscussion = (id: number) =>
    axios.get<Discussion>(`/discussion/${id}`);

export const getDiscussions = (problemId: number) =>
    axios.get<Discussion[]>(`/problems/${problemId}/discussions`);

export const createDiscussion = (data: Discussion) =>
    axios.post<IdResponse>('/discussion', data);

export const updateDiscussion = (data: Discussion) =>
    axios.put<OkResponse>('/discussion', data);

export const voteDiscussion = (data: AddVotePayload) =>
    axios.post<OkResponse>('/discussion/vote', data);
