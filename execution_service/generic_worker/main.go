package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"syscall"
	"time"

	"github.com/redis/go-redis/v9"
	"golang.org/x/sync/errgroup"
)

// Define payload and response structures
type ProblemTestCase struct {
	ID             int
	Input          string
	ExpectedOutput string
}

type TestResult struct {
	ID             int
	Status         string
	Input          string
	ExpectedOutput string
	Output         string
	RuntimeMS      int
	MemoryKB       int
}

type ExecuteCodePayload struct {
	ID            int
	Language      string
	Code          string
	TestCases     []ProblemTestCase
	TimeLimitMS   int
	MemoryLimitKB int
	ExecutionType string
	Points        int
	Penalty       int
}

type ExecuteCodeResponse struct {
	SubmissionID  int
	Results       []TestResult
	ExecutionType string
	ScoreDelta    int
}

// Executor interface
type Executor interface {
	Execute(payload *ExecuteCodePayload) *ExecuteCodeResponse
}

// BaseExecutor with common utilities
type BaseExecutor struct{}

// Optimized memory usage monitoring by reading /proc/[pid]/status
func (b *BaseExecutor) getMemoryUsage(pid int) int {
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

// Execute a command with memory and time monitoring
func (b *BaseExecutor) runCommand(
	ctx context.Context,
	cmd *exec.Cmd,
	stdin string,
	memoryLimitKB int,
) (output string, runtimeMS int, peakMemKB int, status string) {
	var stdoutBuf, stderrBuf bytes.Buffer
	cmd.Stdout = &stdoutBuf
	cmd.Stderr = &stderrBuf

	if stdin != "" {
		cmd.Stdin = strings.NewReader(stdin)
	}

	start := time.Now()
	if err := cmd.Start(); err != nil {
		return fmt.Sprintf("Start failed: %v", err),
			0, 0, "runtime error"
	}

	pid := cmd.Process.Pid
	done := make(chan error, 1)
	go func() { done <- cmd.Wait() }()

	ticker := time.NewTicker(10 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			cmd.Process.Kill()
			return "",
				int(time.Since(start).Milliseconds()),
				peakMemKB, "time limit exceeded"

		case <-ticker.C:
			memKB := b.getMemoryUsage(pid)
			if memKB > 0 {
				if memKB > peakMemKB {
					peakMemKB = memKB

					// Check if memory limit exceeded
					if memoryLimitKB > 0 && peakMemKB > memoryLimitKB {
						cmd.Process.Kill()
						<-done
						return "memory limit exceeded",
							int(time.Since(start).Milliseconds()),
							peakMemKB, "memory limit exceeded"
					}
				}
			}

		case err := <-done:
			runtime := int(time.Since(start).Milliseconds())
			outStr := strings.TrimSpace(stdoutBuf.String())
			errStr := strings.TrimSpace(stderrBuf.String())

			if ctx.Err() == context.DeadlineExceeded {
				return "", runtime, peakMemKB, "time limit exceeded"
			}

			if err != nil {
				result := outStr
				if errStr != "" {
					if result != "" {
						result += "\n"
					}
					result += errStr
				}
				if result == "" {
					result = err.Error()
				}
				return result, runtime, peakMemKB, "runtime error"
			}

			return outStr, runtime, peakMemKB, "accepted"
		}
	}
}

func (b *BaseExecutor) writeFile(path, content string) error {
	return os.WriteFile(path, []byte(content), 0644)
}

func (b *BaseExecutor) errorResponse(payload *ExecuteCodePayload, message string) *ExecuteCodeResponse {
	errRes := make([]TestResult, len(payload.TestCases))
	for i := range payload.TestCases {
		errRes[i] = TestResult{
			ID:     payload.TestCases[i].ID,
			Status: message,
		}
	}
	return &ExecuteCodeResponse{
		SubmissionID:  payload.ID,
		ExecutionType: payload.ExecutionType,
		Results:       errRes,
	}
}

func (b *BaseExecutor) executeTests(
	payload *ExecuteCodePayload,
	testFunc func(ProblemTestCase) TestResult,
) []TestResult {
	g := new(errgroup.Group)
	g.SetLimit(50) // Max 50 concurrent test cases
	mu := &sync.Mutex{}
	results := make([]TestResult, len(payload.TestCases))

	for i, tc := range payload.TestCases {
		i, tc := i, tc // capture loop variables
		g.Go(func() error {
			res := testFunc(tc)
			mu.Lock()
			results[i] = res
			mu.Unlock()
			return nil
		})
	}
	g.Wait()

	return results
}

func (b *BaseExecutor) mapResult(
	tc ProblemTestCase,
	output string,
	runtimeMS int,
	memoryKB int,
	status string,
) TestResult {
	expected := strings.TrimSpace(tc.ExpectedOutput)
	output = strings.TrimSpace(output)

	if status == "accepted" && output != expected {
		status = "wrong answer"
	}

	return TestResult{
		ID:             tc.ID,
		Input:          tc.Input,
		ExpectedOutput: expected,
		Output:         output,
		RuntimeMS:      runtimeMS,
		MemoryKB:       memoryKB,
		Status:         status,
	}
}

// Language executors
type PythonExecutor struct{ BaseExecutor }

func (e *PythonExecutor) Execute(payload *ExecuteCodePayload) *ExecuteCodeResponse {
	tempDir, err := os.MkdirTemp("/tmp", "python-*")
	if err != nil {
		return e.errorResponse(payload, "failed to create temp dir")
	}
	defer os.RemoveAll(tempDir)

	sourcePath := filepath.Join(tempDir, "main.py")
	if err := e.writeFile(sourcePath, payload.Code); err != nil {
		return e.errorResponse(payload, "failed to write source file")
	}

	results := e.executeTests(payload, func(tc ProblemTestCase) TestResult {
		ctx, cancel := context.WithTimeout(context.Background(), time.Duration(payload.TimeLimitMS)*time.Millisecond)
		defer cancel()

		cmd := exec.CommandContext(ctx, "python3", sourcePath)
		output, runtimeMS, memKB, status := e.runCommand(ctx, cmd, tc.Input, payload.MemoryLimitKB)
		return e.mapResult(tc, output, runtimeMS, memKB, status)
	})

	return &ExecuteCodeResponse{
		SubmissionID:  payload.ID,
		ExecutionType: payload.ExecutionType,
		Results:       results,
	}
}

type JavaExecutor struct{ BaseExecutor }

func (e *JavaExecutor) Execute(payload *ExecuteCodePayload) *ExecuteCodeResponse {
	tempDir, err := os.MkdirTemp("/tmp", "java-*")
	if err != nil {
		return e.errorResponse(payload, "failed to create temp dir")
	}
	defer os.RemoveAll(tempDir)

	sourcePath := filepath.Join(tempDir, "Main.java")
	if err := e.writeFile(sourcePath, payload.Code); err != nil {
		return e.errorResponse(payload, "failed to write source file")
	}

	// Compile Java
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	compileCmd := exec.CommandContext(ctx, "javac", sourcePath)
	out, _, _, status := e.runCommand(ctx, compileCmd, "", 0)
	if status != "accepted" {
		res := e.errorResponse(payload, "compilation error")
		for i := range res.Results {
			res.Results[i].Output = out
		}
		return res
	}

	results := e.executeTests(payload, func(tc ProblemTestCase) TestResult {
		ctx, cancel := context.WithTimeout(context.Background(), time.Duration(payload.TimeLimitMS)*time.Millisecond)
		defer cancel()

		cmd := exec.CommandContext(ctx, "java", "-cp", tempDir, "Main")
		output, runtimeMS, memKB, execStatus := e.runCommand(ctx, cmd, tc.Input, payload.MemoryLimitKB)
		return e.mapResult(tc, output, runtimeMS, memKB, execStatus)
	})

	return &ExecuteCodeResponse{
		SubmissionID:  payload.ID,
		ExecutionType: payload.ExecutionType,
		Results:       results,
	}
}

type CppExecutor struct{ BaseExecutor }

func (e *CppExecutor) Execute(payload *ExecuteCodePayload) *ExecuteCodeResponse {
	tempDir, err := os.MkdirTemp("/tmp", "cpp-*")
	if err != nil {
		return e.errorResponse(payload, "failed to create temp dir")
	}
	defer os.RemoveAll(tempDir)

	sourcePath := filepath.Join(tempDir, "main.cpp")
	binPath := filepath.Join(tempDir, "main")
	if err := e.writeFile(sourcePath, payload.Code); err != nil {
		return e.errorResponse(payload, "failed to write source file")
	}

	// Compile C++
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	compileCmd := exec.CommandContext(ctx, "g++", "-O2", "-std=c++17", sourcePath, "-o", binPath)
	out, _, _, status := e.runCommand(ctx, compileCmd, "", 0)
	if status != "accepted" {
		res := e.errorResponse(payload, "compilation error")
		for i := range res.Results {
			res.Results[i].Output = out
		}
		return res
	}

	// Execute tests
	results := e.executeTests(payload, func(tc ProblemTestCase) TestResult {
		ctx, cancel := context.WithTimeout(context.Background(), time.Duration(payload.TimeLimitMS)*time.Millisecond)
		defer cancel()

		cmd := exec.CommandContext(ctx, binPath)
		output, runtimeMS, memKB, execStatus := e.runCommand(ctx, cmd, tc.Input, payload.MemoryLimitKB)
		return e.mapResult(tc, output, runtimeMS, memKB, execStatus)
	})

	return &ExecuteCodeResponse{
		SubmissionID:  payload.ID,
		ExecutionType: payload.ExecutionType,
		Results:       results,
	}
}

type CExecutor struct{ BaseExecutor }

func (e *CExecutor) Execute(payload *ExecuteCodePayload) *ExecuteCodeResponse {
	tempDir, err := os.MkdirTemp("/tmp", "c-*")
	if err != nil {
		return e.errorResponse(payload, "failed to create temp dir")
	}
	defer os.RemoveAll(tempDir)

	sourcePath := filepath.Join(tempDir, "main.c")
	binPath := filepath.Join(tempDir, "main")
	if err := e.writeFile(sourcePath, payload.Code); err != nil {
		return e.errorResponse(payload, "failed to write source file")
	}

	// Compile C
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	compileCmd := exec.CommandContext(ctx, "gcc", "-O2", sourcePath, "-o", binPath)
	out, _, _, status := e.runCommand(ctx, compileCmd, "", 0)
	if status != "accepted" {
		res := e.errorResponse(payload, "compilation error")
		for i := range res.Results {
			res.Results[i].Output = out
		}
		return res
	}

	// Execute tests
	results := e.executeTests(payload, func(tc ProblemTestCase) TestResult {
		ctx, cancel := context.WithTimeout(context.Background(), time.Duration(payload.TimeLimitMS)*time.Millisecond)
		defer cancel()

		cmd := exec.CommandContext(ctx, binPath)
		output, runtimeMS, memKB, execStatus := e.runCommand(ctx, cmd, tc.Input, payload.MemoryLimitKB)
		return e.mapResult(tc, output, runtimeMS, memKB, execStatus)
	})

	return &ExecuteCodeResponse{
		SubmissionID:  payload.ID,
		ExecutionType: payload.ExecutionType,
		Results:       results,
	}
}

type GoExecutor struct{ BaseExecutor }

func (e *GoExecutor) Execute(payload *ExecuteCodePayload) *ExecuteCodeResponse {
	tempDir, err := os.MkdirTemp("/tmp", "go-*")
	if err != nil {
		return e.errorResponse(payload, "failed to create temp dir")
	}
	defer os.RemoveAll(tempDir)

	sourcePath := filepath.Join(tempDir, "main.go")
	binPath := filepath.Join(tempDir, "main")
	if err := e.writeFile(sourcePath, payload.Code); err != nil {
		return e.errorResponse(payload, "failed to write source file")
	}

	// Compile Go
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	compileCmd := exec.CommandContext(ctx, "go", "build", "-o", binPath, sourcePath)
	out, _, _, status := e.runCommand(ctx, compileCmd, "", 0)
	if status != "accepted" {
		res := e.errorResponse(payload, "compilation error")
		for i := range res.Results {
			res.Results[i].Output = out
		}
		return res
	}

	// Execute tests
	results := e.executeTests(payload, func(tc ProblemTestCase) TestResult {
		ctx, cancel := context.WithTimeout(context.Background(), time.Duration(payload.TimeLimitMS)*time.Millisecond)
		defer cancel()

		cmd := exec.CommandContext(ctx, binPath)
		output, runtimeMS, memKB, execStatus := e.runCommand(ctx, cmd, tc.Input, payload.MemoryLimitKB)
		return e.mapResult(tc, output, runtimeMS, memKB, execStatus)
	})

	return &ExecuteCodeResponse{
		SubmissionID:  payload.ID,
		ExecutionType: payload.ExecutionType,
		Results:       results,
	}
}

// Executor factory
func newExecutor(language string) Executor {
	switch language {
	case "python":
		return &PythonExecutor{}
	case "java":
		return &JavaExecutor{}
	case "cpp":
		return &CppExecutor{}
	case "c":
		return &CExecutor{}
	case "go":
		return &GoExecutor{}
	default:
		return &PythonExecutor{} // Default to Python
	}
}

// Worker and main functions
func startWorker(ctx context.Context, rdb *redis.Client, wg *sync.WaitGroup) {
	wg.Add(1)
	go func() {
		defer wg.Done()
		log.Println("🛠️  Worker started...")

		for {
			select {
			case <-ctx.Done():
				log.Println("🛑 Worker context canceled. Exiting...")
				return
			default:
				res, err := rdb.BLPop(ctx, 5*time.Second, "tasks_queue").Result()
				if err != nil {
					if err == redis.Nil {
						continue
					}
					if ctx.Err() != nil {
						log.Println("Context canceled during BLPOP")
						return
					}
					log.Printf("BLPOP error: %v", err)
					time.Sleep(1 * time.Second)
					continue
				}

				var task ExecuteCodePayload
				if err := json.Unmarshal([]byte(res[1]), &task); err != nil {
					log.Printf("Invalid task JSON: %v", err)
					continue
				}

				log.Printf("🔧 Processing task %d (%s)", task.ID, task.Language)

				executor := newExecutor(task.Language)
				result := executor.Execute(&task)

				data, _ := json.Marshal(result)
				if err := rdb.RPush(ctx, "results_queue", data).Err(); err != nil {
					log.Printf("❌ Failed to push result: %v", err)
				} else {
					log.Printf("✅ Pushed result for task %d", task.ID)
				}
			}
		}
	}()
}

func main() {
	log.Println("👷 Worker service starting...")

	redisAddr := os.Getenv("REDIS_ADDR")

	ctx, cancel := context.WithCancel(context.Background())
	var wg sync.WaitGroup

	// Graceful shutdown
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

	// Redis connection
	rdb := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})
	defer rdb.Close()

	// Start worker
	startWorker(ctx, rdb, &wg)

	// Wait for shutdown signal
	<-sigs
	log.Println("🔻 Shutdown signal received.")
	cancel()

	// Wait for clean exit
	wg.Wait()
	log.Println("✅ Worker exited cleanly.")
}
