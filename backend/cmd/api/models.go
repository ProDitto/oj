package main

import "time"

type UserRole string
type ProblemStatus string
type SubmissionStatus string
type ContestStatus string
type Language string
type Difficulty string
type ExecutionType string
type Vote int

type User struct {
	ID             int
	Username       string
	HashedPassword string
	Email          string
	Role           UserRole
	Rating         int
	SolvedProblems []ProblemInfo
}

type ProblemInfo struct {
	ID         int
	Title      string
	Tags       []string
	Difficulty Difficulty
	Slug       string
	Status     string
}

type ProblemExample struct {
	ID             int
	Input          string
	ExpectedOutput string
	Explanation    string
}

type TestCase struct {
	ID             int
	Input          string
	ExpectedOutput string
}

type Limits struct {
	ProblemID     int
	Language      Language
	TimeLimitMS   int
	MemoryLimitKB int
}

type ProblemDetail struct {
	ID               int
	Title            string
	Description      string
	Constraints      []string
	Slug             string
	Tags             []string
	Difficulty       Difficulty
	AuthorID         int
	Status           ProblemStatus
	SolutionLanguage Language
	SolutionCode     string
	TestCases        []TestCase
	Examples         []ProblemExample
	Limits           []Limits
	FailureReason    *string // in case failed to validate
}

type Submission struct {
	ID        int
	ProblemID *int
	UserID    int
	ContestID *int
	Language  Language
	Code      string
	Status    string
	Message   string
	Results   []TestResult
}

type TestResult struct {
	ID             int
	Status         string
	Input          string
	ExpectedOutput string
	Output         string
	RuntimeMS      int
	MemoryKB       int
}

type ContestParticipant struct {
	UserID         int
	Username       string
	Score          int
	ProblemsSolved []ContestProblem
	RatingChange   int // for ELO system
}

type ContestProblem struct {
	*ProblemInfo
	MaxPoints int
}

type Contest struct {
	ID          int
	Name        string
	Status      string
	StartTime   time.Time
	EndTime     time.Time
	Problems    []ContestProblem
	Leaderboard []ContestParticipant
}

type ExecutionPayload struct {
	ID            int
	Language      Language
	Code          string
	TestCases     []TestCase
	TimeLimitMS   int
	MemoryLimitKB int
	ExecutionType ExecutionType
	ContestID     int
	ProblemID     int
}

type ExecutionResponse struct {
	SubmissionID  int
	Results       []TestResult
	ExecutionType ExecutionType
	ContestID     int
	ProblemID     int
}

type Discussion struct {
	ID       int
	Title    string
	Content  string
	Tags     []string
	AuthorID int
	IsActive bool
	Votes    int // Sum of all votes
	Comments []DiscussionComment
}

type DiscussionComment struct {
	ID       int
	Content  string
	AuthorID int
}

type SignupPayload struct {
	Username string
	Email    string
	Password string
}

type LoginPayload struct {
	Username string
	Password string
}

type AddVotePayload struct {
	DiscussionID int
	Vote         Vote
}

type RunCodePayload struct {
	ProblemID int
	Language  Language
	Code      string
	Cases     []TestCase
}

type SubmissionPayload struct {
	ProblemID int
	Language  Language
	Code      string
	ContestID int
}

type CachePoints struct {
	Points int
}

type ContestSolvedProblems struct {
	ContestID  int
	UserID     int
	ProblemID  int
	SolvedAt   int
	ScoreDelta int
}
