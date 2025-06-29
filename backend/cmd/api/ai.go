package main

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	"google.golang.org/genai"
)

type AI struct {
	aiClient            *genai.Client
	service             serviceImpl
	explanationTemplate string
	feedbackTemplate    string
	modelName           string
}

func NewAI(ctx context.Context, apiKey string, service serviceImpl, modelName, feedbackTemplate, explanationTemplate string) (*AI, error) {
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		return nil, err
	}

	for model, err := range client.Models.All(ctx) {
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("Model:", model.Name)
	}

	// log.Println(testResponse(ctx, modelName, client))

	return &AI{
		aiClient:            client,
		service:             service,
		explanationTemplate: explanationTemplate,
		feedbackTemplate:    feedbackTemplate,
		modelName:           modelName,
	}, nil
}

func (ai *AI) AddProblemExplanation(problemID int) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	problem, err := ai.service.GetProblemForAIByID(ctx, problemID)
	if err != nil {
		log.Println("[-] Error fetching problem for AI: ", err)
		return
	}

	prompt := fmt.Sprintf(ai.explanationTemplate, problem.SolutionCode, problem.Constraints[0])

	log.Println("Prompt : ", prompt)

	var config *genai.GenerateContentConfig = &genai.GenerateContentConfig{Temperature: genai.Ptr[float32](0)}
	result, err := ai.aiClient.Models.GenerateContent(ctx, ai.modelName, genai.Text(prompt), config)
	if err != nil {
		log.Fatal(err)
		return
	}

	explanation := result.Text()

	log.Println("Explanation received: ", explanation)

	err = ai.service.UpdateProblemExplanation(ctx, problemID, explanation)
	if err != nil {
		log.Println("Error updating explanation : ", err)
	}
}

func (ai *AI) GetFeedback(ctx context.Context, problemID int, code string) string {
	if strings.TrimSpace(code) == "" {
		return "empty string"
	}

	problem, err := ai.service.GetProblemForAIByID(ctx, problemID)
	if err != nil {
		log.Println("Error fetching problem for AI : ", err)
		return "invalid problem"
	}

	prompt := fmt.Sprintf(ai.feedbackTemplate, problem.Explanation, code)

	var config *genai.GenerateContentConfig = &genai.GenerateContentConfig{Temperature: genai.Ptr[float32](0)}
	result, err := ai.aiClient.Models.GenerateContent(ctx, ai.modelName, genai.Text(prompt), config)
	if err != nil {
		log.Fatal(err)
		return "failed to get response from AI"
	}

	return result.Text()

	// 	return strings.TrimSpace(`
	// ### Feedback Summary

	// Your solution correctly implements the brute-force approach for the Two Sum problem.

	// ---

	// ### ✅ What’s Good
	// - The code is easy to read and well-indented.
	// - You've handled the loop logic correctly and returned the correct indices.

	// ---

	// ### ⚠️ Suggestions for Improvement

	// 1. **Time Complexity**
	//    Your current solution has a time complexity of **O(n²)**. Consider using a **hash map** to reduce this to **O(n)**.

	// 2. **Variable Naming**
	//    Consider using more descriptive names for clarity.

	// ---

	// ### 💡 Recommended Code

	// ` + "```" + `
	// def two_sum(nums, target):
	//     seen = {}
	//     for i, num in enumerate(nums):
	//         complement = target - num
	//         if complement in seen:
	//             return [seen[complement], i]
	//         seen[num] = i
	// ` + "```" + `

	// ---

	// ✅ Passes basic test cases
	// ⚠️ Could be optimized for performance
	// `)
}

// TODO: remove this
func testResponse(ctx context.Context, modelName string, client *genai.Client) string {
	prompt := "explain quantum mechanics like I'm five."

	var config *genai.GenerateContentConfig = &genai.GenerateContentConfig{Temperature: genai.Ptr[float32](0)}
	result, err := client.Models.GenerateContent(ctx, modelName, genai.Text(prompt), config)
	if err != nil {
		log.Fatal(err)
		return "failed to get response from AI"
	}

	return result.Text()
}
