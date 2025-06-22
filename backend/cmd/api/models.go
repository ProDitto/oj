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
	ID             int           `json:"ID,omitempty"`
	Username       string        `json:"Username,omitempty"`
	HashedPassword string        `json:"HashedPassword,omitempty"`
	Email          string        `json:"Email,omitempty"`
	Role           UserRole      `json:"Role,omitempty"`
	Rating         int           `json:"Rating,omitempty"`
	SolvedProblems []ProblemInfo `json:"SolvedProblems,omitempty"`
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
	ID               int              `json:"ID,omitempty"`
	Title            string           `json:"Title,omitempty"`
	Description      string           `json:"Description,omitempty"`
	Constraints      []string         `json:"Constraints,omitempty"`
	Slug             string           `json:"Slug,omitempty"`
	Tags             []string         `json:"Tags,omitempty"`
	Difficulty       Difficulty       `json:"Difficulty,omitempty"`
	AuthorID         int              `json:"AuthorId,omitempty"`
	Status           ProblemStatus    `json:"Status,omitempty"`
	SolutionLanguage Language         `json:"SolutionLanguage,omitempty"`
	SolutionCode     string           `json:"SolutionCode,omitempty"`
	Explanation      string           `json:"Explanation,omitempty"`
	TestCases        []TestCase       `json:"TestCases,omitempty"`
	Examples         []ProblemExample `json:"Examples,omitempty"`
	Limits           []Limits         `json:"Limits,omitempty"`
	FailureReason    *string          `json:"FailureReason,omitempty"`
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
	ID             int
	Title          string
	Content        string
	Tags           []string
	AuthorID       int
	AuthorUsername string
	IsActive       bool
	Votes          int // Sum of all votes
	Comments       []DiscussionComment
}

type DiscussionComment struct {
	ID             int
	Content        string
	AuthorID       int
	AuthorUsername string
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

type AddCommentPayload struct {
	DiscussionID int
	Content      string
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
