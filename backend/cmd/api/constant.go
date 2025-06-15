package main

type CtxKey string

const (
	defaultTimeLimitMS   = 2000   // 2 seconds
	defaultMemoryLimitKB = 65536  // 64 MB
	maxTimeLimitMS       = 5000   // Max 5 seconds
	maxMemoryLimitKB     = 131072 // Max 128 MB
	serverPort           = 8080
	redisUrl             = ""
	dbUrl                = "postgresql://postgres:postgres@localhost:5432/postgres?sslmode=disable"
	AuthCookieName       = "auth_token"

	maxIdleConns = 25
	maxOpenConns = 10

	ContextUserIDKey CtxKey = "user_id"
	ContextRoleKey   CtxKey = "user_role"
)

var jwtSecret = []byte("secret")
