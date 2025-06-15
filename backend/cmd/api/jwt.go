package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// CreateJWTToken creates a signed JWT token with user_id and role
func CreateJWTToken(userID int, role string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"role":    role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// AuthMiddleware validates JWT in the auth_token cookie and sets user_id and role in context
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie(AuthCookieName)
		if err != nil || strings.TrimSpace(cookie.Value) == "" {
			http.Error(w, "unauthorized: missing auth token", http.StatusUnauthorized)
			return
		}

		tokenStr := strings.TrimSpace(cookie.Value)

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("invalid signing method")
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "unauthorized: invalid token", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "unauthorized: invalid claims", http.StatusUnauthorized)
			return
		}

		// Extract claims
		userIDFloat, ok := claims["user_id"].(float64)
		if !ok {
			http.Error(w, "unauthorized: missing user_id", http.StatusUnauthorized)
			return
		}

		roleStr, ok := claims["role"].(string)
		if !ok {
			http.Error(w, "unauthorized: missing role", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), ContextUserIDKey, int(userIDFloat))
		ctx = context.WithValue(ctx, ContextRoleKey, roleStr)

		fmt.Println("Auth middleware: ", int(userIDFloat), roleStr)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// AdminOnlyMiddleware ensures the user has the "admin" role.
func AdminOnlyMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Retrieve role from context (set by AuthMiddleware)
		roleStr, ok := r.Context().Value(ContextRoleKey).(string)
		fmt.Println("Admin only middleware: ", ok, roleStr)
		if !ok || roleStr != "admin" {
			http.Error(w, "unauthorized: insufficient role", http.StatusUnauthorized)
			return
		}

		// If role is "admin", allow access
		next.ServeHTTP(w, r)
	})
}
