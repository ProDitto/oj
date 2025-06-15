package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type Handler struct {
	service *serviceImpl
	redis   *RedisService
}

func NewHandler(service *serviceImpl, redis *RedisService) *Handler {
	return &Handler{service: service, redis: redis}
}

func (h *Handler) Routes() http.Handler {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	// A good base middleware stack
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Post("/signup", h.Signup)
	r.Post("/login", h.Login)
	r.Post("/logout", h.Logout)
	r.Get("/profile/{username}", h.GetUserProfile)
	r.Get("/problems", h.GetProblems)
	r.Get("/problem/{slug}", h.GetProblemBySlug)

	// Public contest access
	r.Get("/contests", h.GetAllContests)
	r.Get("/contest/{id}", h.GetContestByID)
	r.Get("/contest/{id}/leaderboard", h.GetLeaderboard)

	r.Get("/discussion/{id}", h.GetDiscussionByID)
	r.Get("/problems/{problemId}/discussions", h.GetDiscussionsByProblemID)

	// Protected routes
	r.Group(func(protected chi.Router) {
		protected.Use(AuthMiddleware)

		r.Group(func(admin chi.Router) {
			admin.Use(AuthMiddleware)
			admin.Use(AdminOnlyMiddleware)

			admin.Get("/problem-list/{slug}", h.AdminGetProblemBySlug)
			admin.Get("/problem-list", h.AdminGetProblems)
			admin.Post("/problems", h.AddProblem)
			admin.Put("/problems/{id}", h.UpdateProblem)

			admin.Post("/contest", h.CreateContest)
			admin.Put("/contest/{id}", h.UpdateContest)

			admin.Post("/contest/{id}/start", h.StartContest)
			admin.Post("/contest/{id}/end", h.EndContest)
		})
		protected.Get("/me", h.GetCurrentUserProfile)

		protected.Post("/run", h.RunCode)
		protected.Post("/submit", h.SubmitCode)

		protected.Get("/submissions/{problemID}", h.GetUserSubmissions)
		protected.Get("/run/{runID}", h.GetRunResult)
		protected.Get("/submission/{runID}", h.GetSubmissionResult)

		protected.Post("/contest/{id}/join", h.JoinContest)

		protected.Post("/discussion", h.CreateDiscussion)
		protected.Put("/discussion", h.UpdateDiscussion)
		protected.Post("/discussion/vote", h.AddVoteToDiscussion)
	})

	return r
}

// --- AUTH ---

func (h *Handler) Signup(w http.ResponseWriter, r *http.Request) {
	var payload SignupPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userId, role, err := h.service.Register(r.Context(), payload.Username, payload.Email, payload.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	token, err := CreateJWTToken(userId, role)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	setAuthCookie(w, token)
	json.NewEncoder(w).Encode(map[string]any{"message": "ok"})
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	setAuthCookie(w, "")
	json.NewEncoder(w).Encode(map[string]any{"message": "ok"})
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var payload LoginPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Println("\n\n", payload.Username, payload.Password)

	userId, role, err := h.service.Login(r.Context(), payload.Username, payload.Password)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	token, err := CreateJWTToken(userId, role)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	setAuthCookie(w, token)
	json.NewEncoder(w).Encode(map[string]any{"message": "ok"})
}

func (h *Handler) GetCurrentUserProfile(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(ContextUserIDKey).(int)

	user, err := h.service.GetUserByID(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(user)
}

func (h *Handler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	username := chi.URLParam(r, "username")
	user, err := h.service.GetUserProfile(r.Context(), username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(user)
}

// --- PROBLEMS ---

func (h *Handler) AdminGetProblemBySlug(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	problem, err := h.service.AdminGetProblemBySlug(r.Context(), slug)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(problem)
}

func (h *Handler) AdminGetProblems(w http.ResponseWriter, r *http.Request) {
	problems, err := h.service.AdminGetProblems(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(problems)
}

func (h *Handler) GetProblemBySlug(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	problem, err := h.service.GetProblemBySlug(r.Context(), slug)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(problem)
}

func (h *Handler) GetProblems(w http.ResponseWriter, r *http.Request) {
	problems, err := h.service.GetProblems(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(problems)
}

func (h *Handler) AddProblem(w http.ResponseWriter, r *http.Request) {
	var p ProblemDetail
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	id, err := h.service.AddProblem(r.Context(), &p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]int{"id": id})
}

func (h *Handler) UpdateProblem(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(chi.URLParam(r, "id"))
	var p ProblemDetail
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := h.service.UpdateProblemByID(r.Context(), id, &p); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// --- CODE EXECUTION / SUBMISSION ---

func (h *Handler) RunCode(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(ContextUserIDKey).(int)

	var payload RunCodePayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	runID, err := h.service.RunCode(r.Context(), userID, payload.ProblemID, payload.Language, payload.Code, payload.Cases)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]int{"run_id": runID})
}

func (h *Handler) GetRunResult(w http.ResponseWriter, r *http.Request) {
	runID, _ := strconv.Atoi(chi.URLParam(r, "runID"))
	result, err := h.service.GetRunResult(r.Context(), runID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(result)
}

func (h *Handler) SubmitCode(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(ContextUserIDKey).(int)
	if !ok {
		http.Error(w, "unauthorized: missing user_id in context", http.StatusUnauthorized)
		return
	}

	var sub SubmissionPayload
	if err := json.NewDecoder(r.Body).Decode(&sub); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	id, err := h.service.SubmitCode(r.Context(), userID, sub.ProblemID, sub.ContestID, sub.Language, sub.Code)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]int{"submission_id": id})
}

func (h *Handler) GetSubmissionResult(w http.ResponseWriter, r *http.Request) {
	runID, _ := strconv.Atoi(chi.URLParam(r, "runID"))
	sub, err := h.service.GetSubmissionResult(r.Context(), runID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	sub.Results = make([]TestResult, 0)
	json.NewEncoder(w).Encode(sub)
}

func (h *Handler) GetUserSubmissions(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(ContextUserIDKey).(int)
	if !ok {
		http.Error(w, "unauthorized: missing user_id in context", http.StatusUnauthorized)
		return
	}

	problemID, _ := strconv.Atoi(chi.URLParam(r, "problemID"))

	subs, err := h.service.GetUserSubmissions(r.Context(), userID, problemID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(subs)
}

// --- CONTESTS ---

func (h *Handler) CreateContest(w http.ResponseWriter, r *http.Request) {
	var c Contest
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	id, err := h.service.CreateContest(r.Context(), &c)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]int{"contest_id": id})
}

func (h *Handler) UpdateContest(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(chi.URLParam(r, "id"))
	var c Contest
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.UpdateContest(r.Context(), id, &c); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) GetAllContests(w http.ResponseWriter, r *http.Request) {
	contests, err := h.service.GetAllContests(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(contests)
}

func (h *Handler) GetContestByID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(chi.URLParam(r, "id"))
	contest, err := h.service.GetContestByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(contest)
}

func (h *Handler) JoinContest(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(ContextUserIDKey).(int)
	if !ok {
		http.Error(w, "unauthorized: missing user_id in context", http.StatusUnauthorized)
		return
	}
	contestID, _ := strconv.Atoi(chi.URLParam(r, "id"))

	err := h.service.JoinContestByID(r.Context(), userID, contestID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) StartContest(w http.ResponseWriter, r *http.Request) {
	contestID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid contest ID", http.StatusBadRequest)
		return
	}

	// Retrieve the contest data
	contest, err := h.service.GetContestByID(r.Context(), contestID)
	if err != nil {
		http.Error(w, "Failed to fetch contest: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Cache each problem's max points in Redis
	for _, problem := range contest.Problems {
		key := GetContestProblemKey(contestID, problem.ID)
		value := CachePoints{Points: problem.MaxPoints}
		err := h.redis.Set(r.Context(), key, value, 4*time.Hour)
		if err != nil {
			// Log the error but continue processing other problems
			// log.Printf("Failed to cache problem %d: %v", problem.ID, err)
			continue
		}
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) EndContest(w http.ResponseWriter, r *http.Request) {
	contestID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid contest ID", http.StatusBadRequest)
		return
	}

	// Optionally: remove cached contest problem data from Redis
	contest, err := h.service.GetContestByID(r.Context(), contestID)
	if err == nil {
		for _, problem := range contest.Problems {
			key := GetContestProblemKey(contestID, problem.ID)
			_ = h.redis.Delete(r.Context(), key)
			// if err != nil {
			// 	log.Printf("Failed to delete key: %v", err)
			// }
		}
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	contestID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	lb, err := h.service.GetLeaderboard(r.Context(), contestID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(lb)
}

// --- DISCUSSION ---

func (h *Handler) CreateDiscussion(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(ContextUserIDKey).(int)
	if !ok {
		http.Error(w, "unauthorized: missing user_id in context", http.StatusUnauthorized)
		return
	}
	var d Discussion
	if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	d.AuthorID = userID
	id, err := h.service.CreateDiscussion(r.Context(), &d)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]int{"discussion_id": id})
}

func (h *Handler) UpdateDiscussion(w http.ResponseWriter, r *http.Request) {
	var d Discussion
	if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.UpdateDiscussion(r.Context(), &d); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) GetDiscussionByID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(chi.URLParam(r, "id"))
	d, err := h.service.GetDiscussionByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(d)
}

func (h *Handler) GetDiscussionsByProblemID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(chi.URLParam(r, "problemId"))
	d, err := h.service.GetDiscussionsByProblem(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(d)
}

func (h *Handler) AddVoteToDiscussion(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(ContextUserIDKey).(int)
	if !ok {
		http.Error(w, "unauthorized: missing user_id in context", http.StatusUnauthorized)
		return
	}

	var payload AddVotePayload

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.AddVoteToDiscussion(r.Context(), userID, payload.DiscussionID, payload.Vote); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
