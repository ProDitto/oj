export type UserRole = 'admin' | 'user';
export type ProblemStatus = 'draft' | 'validate' | 'active' | 'rejected' | 'archieved';
export type SubmissionStatus = 'pending' | 'accepted' | 'rejected';
export type ContestStatus = 'upcoming' | 'ongoing' | 'finished';
export type Language = 'python' | 'cpp' | 'java' | 'javascript';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Vote = 1 | -1;

export interface User {
    ID: number;
    Username: string;
    HashedPassword: string;
    Email: string;
    Role: UserRole;
    Rating: number;
    SolvedProblems: ProblemInfo[];
}

export interface ProblemInfo {
    ID: number;
    Title: string;
    Slug: string;
    Tags: string[];
    Difficulty: Difficulty;
    Status: ProblemStatus;
}

export interface TestCase {
    ID: number;
    Input: string;
    ExpectedOutput: string;
}

export interface ProblemExample {
    ID: number;
    Input: string;
    ExpectedOutput: string;
    Explanation: string;
}

export interface Limits {
    ProblemID: number;
    Language: Language;
    TimeLimitMS: number;
    MemoryLimitKB: number;
}

export interface ProblemDetail {
    ID: number;
    Title: string;
    Description: string;
    Constraints: string[];
    Slug: string;
    Tags: string[];
    Difficulty: Difficulty;
    AuthorID: number;
    Status: ProblemStatus;
    SolutionLanguage: Language;
    SolutionCode: string;
    TestCases: TestCase[];
    Examples: ProblemExample[];
    Limits: Limits[];
    FailureReason: string;
}

export interface TestResult {
    ID: number;
    Status: SubmissionStatus;
    StdOut: string;
    StdErr: string;
    RuntimeMS: number;
    MemoryKB: number;
}

export interface Submission {
    ID: number;
    ProblemID: number;
    UserID: number;
    ContestID: number;
    Language: Language;
    Code: string; w
    Status: SubmissionStatus;
    Message: string;
    Results: TestResult[];
}

export interface ContestProblem extends ProblemInfo {
    // ProblemInfo: ProblemInfo;
    MaxPoints: number;
}

export interface ContestParticipant {
    UserID: number;
    Username: string;
    Score: number;
    ProblemsSolved: ContestProblem[];
    RatingChange: number;
}

export interface Contest {
    ID: number;
    Name: string;
    Status: ContestStatus;
    StartTime: string; // ISO date-time string
    EndTime: string;
    Problems: ContestProblem[];
    Leaderboard: ContestParticipant[];
}

export interface DiscussionComment {
    ID: number
    Content: string;
    AuthorID: number;
}

export interface Discussion {
    ID: number;
    Title: string;
    Content: string;
    Tags: string[];
    AuthorID: number;
    Votes: number;
    Comments: DiscussionComment[];
}

export interface SignupPayload {
    Username: string;
    Email: string;
    Password: string;
}

export interface LoginPayload {
    Username: string;
    Password: string;
}

export interface RunCodePayload {
    ProblemID: number;
    Language: Language;
    Code: string;
    Cases: TestCase[];
}

export interface SubmissionPayload {
    ProblemID: number;
    Language: Language;
    Code: string;
}

export interface AddVotePayload {
    DiscussionID: number;
    Vote: Vote;
}

export interface OkResponse {
    message: string;
}

export interface IdResponse {
    id: number;
    run_id: number;
    submission_id: number;
}