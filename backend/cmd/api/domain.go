package main

import (
	"context"
)

type Service interface {
	Register(ctx context.Context, username, email, password string) (int, string, error)
	Login(ctx context.Context, username, password string) (int, string, error)
	GetUserProfile(ctx context.Context, username string) (*User, error)
	GetUserByID(ctx context.Context, userID int) (*User, error)

	GetProblems(ctx context.Context) ([]ProblemInfo, error)
	AddProblem(ctx context.Context, problem *ProblemDetail) (int, error)
	UpdateProblemByID(ctx context.Context, id int, problem *ProblemDetail) error
	GetProblemBySlug(ctx context.Context, slug string) (*ProblemDetail, error)

	RunCode(context.Context, int, int, Language, string, []TestCase) (int, error)
	GetRunResult(ctx context.Context, runID int) (Submission, error)
	SubmitCode(ctx context.Context, userID, problemID int, language Language, code string) (int, error)
	GetSubmissionResult(ctx context.Context, runID int) (Submission, error)
	GetUserSubmissions(ctx context.Context, userID, problemID int) ([]Submission, error)

	CreateContest(ctx context.Context, contest *Contest) (int, error)
	UpdateContest(ctx context.Context, id int, contest *Contest) error
	GetAllContests(ctx context.Context) ([]Contest, error)
	GetContestByID(ctx context.Context, contestID int) (*Contest, error)
	JoinContestByID(ctx context.Context, userID, contestID int) error
	StartContest(ctx context.Context, contestID int) error // Add contest details to cache
	EndContest(ctx context.Context, contestID int) error   // Remove contest from thhe cache
	GetLeaderboard(ctx context.Context, contestID int) ([]ContestParticipant, error)

	CreateDiscussion(ctx context.Context, discussion *Discussion) (int, error)
	UpdateDiscussion(ctx context.Context, discussion *Discussion) error
	GetDiscussionByID(ctx context.Context, discussionID int) (*Discussion, error)
	AddVoteToDiscussion(ctx context.Context, userID, discussionID int, vote Vote) error
	// AddVoteToComment(ctx context.Context, discussionID int, comment string) (int, error)
}

// type QueueService interface {
// 	Enqueue(ctx context.Context, queue string, payload any) error
// 	StartWorker(ctx context.Context, queue string, handler func(payload []byte) error, wg *sync.WaitGroup)
// 	Shutdown() error
// }

// type CacheService interface {
// 	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
// 	Get(ctx context.Context, key string) (string, error)
// 	Delete(ctx context.Context, key string) error
// 	Exists(ctx context.Context, key string) (bool, error)
// 	Increment(ctx context.Context, key string) (int64, error)
// 	SetNX(ctx context.Context, key string, value interface{}, expiration time.Duration) (bool, error)
// 	GetTTL(ctx context.Context, key string) (time.Duration, error)
// 	Close() error
// }
