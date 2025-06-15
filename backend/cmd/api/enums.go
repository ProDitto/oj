package main

const (
	// ROLE_USER  UserRole = "user"
	// ROLE_ADMIN UserRole = "admin"

	PROBLEM_STATUS_DRAFT     ProblemStatus = "draft"
	PROBLEM_STATUS_VALIDATE  ProblemStatus = "validate"
	PROBLEM_STATUS_ACTIVE    ProblemStatus = "active"
	PROBLEM_STATUS_REJECTED  ProblemStatus = "rejected"
	PROBLEM_STATUS_ARCHIEVED ProblemStatus = "archieved"

	SUBMISSION_STATUS_PENDING           SubmissionStatus = "pending"
	SUBMISSION_STATUS_ACCEPTED          SubmissionStatus = "accepted"
	SUBMISSION_STATUS_WRONG_ANSWER      SubmissionStatus = "wrong answer"
	SUBMISSION_STATUS_TLE               SubmissionStatus = "time limit exceeded"
	SUBMISSION_STATUS_MLE               SubmissionStatus = "memory limit exceeded"
	SUBMISSION_STATUS_COMPILATION_ERROR SubmissionStatus = "compilation error"
	SUBMISSION_STATUS_RUNTIME_ERROR     SubmissionStatus = "runtime error"

	CONTEST_STATUS_WAITING   ContestStatus = "waiting"
	CONTEST_STATUS_RUNNING   ContestStatus = "running"
	CONTEST_STATUS_ENDED     ContestStatus = "ended"
	CONTEST_STATUS_CANCELLED ContestStatus = "cancelled"

	LANGUAGE_GO     Language = "go"
	LANGUAGE_PYTHON Language = "python"
	LANGUAGE_CPP    Language = "cpp"
	LANGUAGE_JAVA   Language = "java"
	LANGUAGE_C      Language = "c"

	DIFFICULTY_EASY   Difficulty = "easy"
	DIFFICULTY_MEDIUM Difficulty = "medium"
	DIFFICULTY_HARD   Difficulty = "hard"

	EXECUTION_RUN            ExecutionType = "run"
	EXECUTION_SUBMIT         ExecutionType = "submit"
	EXECUTION_CONTEST_SUBMIT ExecutionType = "contest"
	EXECUTION_VALIDATE       ExecutionType = "validate"

	VOTE_NIL  Vote = 0
	VOTE_UP   Vote = 1
	VOTE_DOWN Vote = -1
)
