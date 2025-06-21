package main

type CtxKey string

const (
	defaultTimeLimitMS   = 2000   // 2 seconds
	defaultMemoryLimitKB = 65536  // 64 MB
	maxTimeLimitMS       = 5000   // Max 3 seconds
	maxMemoryLimitKB     = 131072 // Max 50 MB
	AuthCookieName       = "auth_token"
	// serverPort           = 8080
	// redisUrl             = ""
	// dbUrl                = "postgresql://postgres:postgres@localhost:5432/postgres?sslmode=disable"

	maxIdleConns = 25
	maxOpenConns = 10

	ContextUserIDKey CtxKey = "user_id"
	ContextRoleKey   CtxKey = "user_role"

	// API_KEY              = "apiKey"
	// AI_MODEL             = "gemini-2.0-flash"
	// FEEDBACK_TEMPLATE    = "code:%s constraints:%s solution:%s"
	// EXPLANATION_TEMPLATE = "code:%s constraints:%s"
)

var jwtSecret = []byte("secret")
