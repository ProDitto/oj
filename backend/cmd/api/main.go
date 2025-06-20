package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sync"
)

func main() {
	redisService := NewRedisService(redisUrl)

	postgres, err := NewPostgreSQLDB(dbUrl, maxIdleConns, maxOpenConns)
	if err != nil {
		log.Fatalf("Error initializing PostgreSQL: %v", err)
	}

	defer func() {
		if err := postgres.Close(); err != nil {
			log.Printf("Error closing the PostgreSQL connection: %v", err)
		}
	}()

	db := postgres.conn

	ctx, cancel := context.WithCancel(context.TODO())
	defer cancel()

	srv := NewService(db, redisService)

	aiClient, err := NewAI(ctx, *srv)
	if err != nil {
		log.Fatal("Error initializing AI Client : ", err)
	}

	h := NewHandler(srv, redisService, aiClient)
	// Set up the routes
	r := h.Routes()

	var wg sync.WaitGroup

	redisService.StartResultWorker(ctx, func(er *ExecutionResponse) {
		status, runtime, memory := "Accepted", 0, 0
		for i, v := range er.Results {
			if v.RuntimeMS > runtime {
				runtime = v.RuntimeMS
			}
			if v.MemoryKB > memory {
				memory = v.MemoryKB
			}
			if v.Status != "Accepted" {
				status = fmt.Sprintf("%s on Test Case : %d", v.Status, i+1)
			}
		}
		if er.ExecutionType == EXECUTION_RUN || er.ExecutionType == EXECUTION_SUBMIT {
			if er.ExecutionType == EXECUTION_SUBMIT {
				for i := range er.Results {
					er.Results[i].Input = ""
					er.Results[i].Output = ""
					er.Results[i].ExpectedOutput = ""
				}
			}
			err := srv.UpdateSubmission(ctx, &Submission{
				ID:     er.SubmissionID,
				Status: status,
				// Status:  "accepted",
				Message: "<Placeholder for message>",
				Results: er.Results,
			})
			if err != nil {
				log.Println("\n\n\nError updating the submission: ", err.Error())
			} else {
				log.Println("\n\n\nSumission updated successfully for ID : ", er.SubmissionID)
			}
		} else if er.ExecutionType == EXECUTION_VALIDATE {
			log.Println("\n\n\nResponse:")
			log.Println(er)
			var problemStatus ProblemStatus = "active"
			for _, res := range er.Results {
				if res.Status != "accepted" {
					problemStatus = "rejected"
				}
			}
			log.Println("Status : ", problemStatus, er.ProblemID, er.SubmissionID)
			err := srv.UpdateProblemStatus(ctx, er.SubmissionID, problemStatus)
			if err != nil {
				log.Println(err)
			}
		}
	}, &wg)

	// Set up the server
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", serverPort),
		Handler: r,
	}

	// Start the server
	log.Println("Server started on :8080")
	if err := server.ListenAndServe(); err != nil {
		log.Fatal("Server failed to start: ", err)
	}

	wg.Wait()

}
