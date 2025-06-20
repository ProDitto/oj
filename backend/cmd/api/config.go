package main

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	SERVER_PORT          int
	REDIS_URI            string
	DB_URI               string
	AI_API_KEY           string
	AI_MODEL_NAME        string
	FEEDBACK_TEMPLATE    string
	EXPLANATION_TEMPLATE string
}

func LoadDotEnv() error {
	return godotenv.Load(".env")
}

// Helper: get required env var
func getEnv(key string, required bool) (string, error) {
	val := os.Getenv(key)
	if val == "" && required {
		return "", fmt.Errorf("missing required environment variable: %s", key)
	}
	return val, nil
}

// Helper: get optional env var with default
func getEnvOrDefault(key, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	return val
}

func GetConfig() (*Config, error) {
	// SERVER_PORT with fallback
	portStr := getEnvOrDefault("SERVER_PORT", "8080")
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return nil, fmt.Errorf("invalid SERVER_PORT: %v", err)
	}

	// Required values
	dbURI, err := getEnv("DB_URI", true)
	if err != nil {
		return nil, err
	}

	apiKey, err := getEnv("AI_API_KEY", true)
	if err != nil {
		return nil, err
	}

	// Optional with defaults
	redisURI := getEnvOrDefault("REDIS_URI", "")
	modelName := getEnvOrDefault("AI_MODEL_NAME", "gemini-2.0-flash")
	feedbackTemplate := getEnvOrDefault("FEEDBACK_TEMPLATE", "code:%s constraints:%s solution:%s")
	explanationTemplate := getEnvOrDefault("EXPLANATION_TEMPLATE", "code:%s constraints:%s")

	cfg := &Config{
		SERVER_PORT:          port,
		REDIS_URI:            redisURI,
		DB_URI:               dbURI,
		AI_API_KEY:           apiKey,
		AI_MODEL_NAME:        modelName,
		FEEDBACK_TEMPLATE:    feedbackTemplate,
		EXPLANATION_TEMPLATE: explanationTemplate,
	}

	return cfg, nil
}
