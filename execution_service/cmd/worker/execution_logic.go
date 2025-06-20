package main

import (
	"bufio"
	"bytes"
	"context"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

func getMemoryUsage(pid int) int {
	statusPath := fmt.Sprintf("/proc/%d/status", pid)
	file, err := os.Open(statusPath)
	if err != nil {
		return -1
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		if strings.HasPrefix(scanner.Text(), "VmRSS:") {
			fields := strings.Fields(scanner.Text())
			memKB, _ := strconv.Atoi(fields[1])
			return memKB
		}
	}
	return -1
}

func ExecutePython(payload ExecuteCodePayload) (response ExecuteCodeResponse) {
	os.MkdirAll("./out", os.ModePerm)
	sourcePath := filepath.Join("out", "test.py")

	err := os.WriteFile(sourcePath, []byte(payload.Code), 0644)
	if err != nil {
		log.Println("Failed to write source file:", err)
		return ExecuteCodeResponse{
			SubmissionID:  payload.ID,
			ExecutionType: payload.ExecutionType,
		}
	}

	var results []TestResult
	// finalStatus := "Accepted"
	for _, tc := range payload.TestCases {
		ctx, cancel := context.WithTimeout(context.Background(), time.Duration(payload.TimeLimitMS)*time.Millisecond)
		defer cancel()

		cmd := exec.CommandContext(ctx, "python3", sourcePath)
		cmd.Stdin = bytes.NewBufferString(tc.Input)

		var outBuf bytes.Buffer
		cmd.Stdout = &outBuf
		cmd.Stderr = &outBuf // Capture stderr too

		start := time.Now()
		if err := cmd.Start(); err != nil {
			results = append(results, TestResult{
				ID:             tc.ID,
				Input:          tc.Input,
				Output:         err.Error(),
				ExpectedOutput: tc.ExpectedOutput,
				RuntimeMS:      0,
				MemoryKB:       0,
				Status:         "runtime error",
			})
			continue
		}

		pid := cmd.Process.Pid
		peakMem := getMemoryUsage(pid)

		done := make(chan error)
		go func() { done <- cmd.Wait() }()

		var status string
		ticker := time.NewTicker(10 * time.Millisecond)
		defer ticker.Stop()

		output := ""

	loop:
		for {
			select {
			case <-ticker.C:
				mem := getMemoryUsage(pid)
				if mem > peakMem {
					peakMem = mem
				}
				if payload.MemoryLimitKB > 0 && mem > payload.MemoryLimitKB {
					_ = cmd.Process.Kill()
					status = "memory limit exceeded"
					break loop
				}
			case <-ctx.Done():
				_ = cmd.Process.Kill()
				status = "time limit exceeded"
				break loop
			case err := <-done:
				if err != nil {
					status = "runtime error"
					output = err.Error()

				} else {
					status = "accepted"
				}
				break loop
			}
		}

		end := time.Since(start)
		if output == "" {
			output = strings.TrimSpace(outBuf.String())
		}
		expected := strings.TrimSpace(tc.ExpectedOutput)

		if status == "accepted" && output != expected {
			status = "wrong answer"
		}

		// if status != "Accepted" {
		// 	finalStatus = status
		// }

		results = append(results, TestResult{
			ID:             tc.ID,
			Input:          tc.Input,
			Output:         output,
			ExpectedOutput: expected,
			RuntimeMS:      int(end.Milliseconds()),
			MemoryKB:       peakMem,
			Status:         status,
		})
	}

	response = ExecuteCodeResponse{
		SubmissionID:  payload.ID,
		ExecutionType: payload.ExecutionType,
		Results:       results,
		ScoreDelta:    0,
	}
	return response
}
