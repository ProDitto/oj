package main

import (
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"
)

// Helper functions for password hashing
func hashPassword(pw string) (string, error) {
	// Just a mock hash function, use bcrypt or a better hashing algorithm in production.
	return pw + "_hash", nil
}

// func comparePassword(hash, pw string) error {
// 	if hash != pw+"_hashed" {
// 		return fmt.Errorf("wrong password")
// 	}
// 	return nil
// }

func setAuthCookie(w http.ResponseWriter, token string) {
	http.SetCookie(w, &http.Cookie{
		Name:     AuthCookieName,
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		Expires:  time.Now().Add(24 * time.Hour),
	})
}

func GetContestProblemKey(contestId, problemId int) string {
	return fmt.Sprintf("%d:%d", contestId, problemId)
}

func CreateSlug(input string) string {
	// Remove special characters
	reg, err := regexp.Compile("[^a-zA-Z0-9]+")
	if err != nil {
		panic(err)
	}
	processedString := reg.ReplaceAllString(input, " ")

	// Remove leading and trailing spaces
	processedString = strings.TrimSpace(processedString)

	// Replace spaces with dashes
	slug := strings.ReplaceAll(processedString, " ", "-")

	// Convert to lowercase
	slug = strings.ToLower(slug)

	return slug
}
