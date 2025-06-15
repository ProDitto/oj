-- Users Table
INSERT INTO users (username, hashed_password, email, role, rating) VALUES
('john_doe', 'pass_hash', 'john@example.com', 'user', 1500),
('admin', 'pass_hash', 'admin@example.com', 'admin', 2000),
('alice', 'pass_hash', 'alice@example.com', 'user', 1800),
('bob', 'pass_hash', 'bob@example.com', 'user', 1600);

-- Problems Table
INSERT INTO problems (title, description, difficulty, author_id, status, solution_language, solution_code, slug) VALUES
('Two Sum', 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.', 'easy', 1, 'active', 'python', 'def two_sum(nums, target):\n  ...','two-sum'),
('Longest Substring Without Repeating Characters', 'Given a string, find the length of the longest substring without repeating characters.', 'medium', 2, 'active', 'cpp', 'int lengthOfLongestSubstring(string s) {\n  ...','longest-substr'),
('N-Queens Problem', 'Solve the N-Queens problem where you must place N queens on an N x N chessboard such that no two queens threaten each other.', 'hard', 3, 'draft', 'java', 'public class Solution {\n  ...','n-queens');

-- Problem Tags Table
INSERT INTO problem_tags (problem_id, tag) VALUES
(1, 'array'),
(1, 'hashmap'),
(2, 'string'),
(2, 'sliding_window'),
(3, 'backtracking'),
(3, 'recursion');

-- Test Cases Table
INSERT INTO test_cases (problem_id, input, expected_output) VALUES
(1, '[2, 7, 11, 15]\n9', '[0, 1]'),
(2, '"abcabcbb"\n', '3'),
(3, '4\n', '[[".Q..", "...Q", "Q...", "..Q."]]');

-- Users Solving Problems Table
INSERT INTO solved_problems (user_id, problem_id, solved_at) VALUES
(1, 1, '2025-06-01 10:00:00'),
(2, 2, '2025-06-02 14:00:00'),
(3, 3, '2025-06-03 16:30:00');

-- Submissions Table
INSERT INTO submissions (problem_id, user_id, contest_id, language, code, status, message) VALUES
(1, 1, NULL, 'python', 'def two_sum(nums, target):\n  ...', 'accepted', 'Solution is correct'),
(2, 2, NULL, 'cpp', 'int lengthOfLongestSubstring(string s) {\n  ...}', 'wrong answer', 'Incorrect logic for sliding window'),
(3, 3, NULL, 'java', 'public class Solution {\n  ...}', 'pending', 'Waiting for execution');

-- Test Results Table
INSERT INTO test_results (submission_id, status, stdout, stderr, runtime_ms, memory_kb) VALUES
(1, 'accepted', 'Output: [0, 1]', '', 50, 10),
(2, 'wrong answer', 'Output: 3', 'Expected output: 2', 100, 15),
(3, 'pending', '', '', 0, 0);

-- Contests Table
INSERT INTO contests (name, status, start_time, end_time) VALUES
('June Coding Challenge', 'running', '2025-06-05 09:00:00', '2025-06-05 18:00:00'),
('Algorithms Contest', 'waiting', '2025-06-10 09:00:00', '2025-06-10 18:00:00');

-- Contest Problems Table
INSERT INTO contest_problems (contest_id, problem_id, max_points) VALUES
(1, 1, 100),
(1, 2, 150),
(2, 3, 200);

-- Contest Participants Table
INSERT INTO contest_participants (contest_id, user_id, score, rating_change) VALUES
(1, 1, 80, 50),
(1, 2, 90, 100),
(2, 3, 0, 0);

-- Execution Payloads Table
INSERT INTO execution_payloads (language, code, time_limit_ms, memory_limit_kb, execution_type, points, penalty) VALUES
('python', 'def two_sum(nums, target):\n  ...', 1000, 1024, 'submit', 100, 10),
('cpp', 'int lengthOfLongestSubstring(string s) {\n  ...}', 1500, 2048, 'run', 150, 20),
('java', 'public class Solution {\n  ...}', 2000, 4096, 'contest', 200, 30);

-- Execution Testcases Table
INSERT INTO execution_testcases (payload_id, testcase_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Execution Responses Table
INSERT INTO execution_responses (submission_id, execution_type, score_delta) VALUES
(1, 'submit', 50),
(2, 'run', -20),
(3, 'contest', 0);

-- Discussions Table
INSERT INTO discussions (problem_id, title, content, author_id, is_active) VALUES
(1, 'How to optimize the Two Sum problem?', 'What’s the most efficient approach to solve the Two Sum problem?', 1, TRUE),
(2, 'Longest Substring Complexity Analysis', 'Why does the sliding window technique improve time complexity?', 2, TRUE),
(3, 'N-Queens Backtracking Explanation', 'Can anyone explain the backtracking approach for the N-Queens problem?', 3, TRUE);

-- Discussion Votes Table
INSERT INTO discussion_votes (user_id, discussion_id, vote) VALUES
(1, 1, 1),
(2, 2, -1),
(3, 3, 0);

-- Discussion Comments Table
INSERT INTO discussion_comments (discussion_id, author_id, content) VALUES
(1, 1, 'I think using a hash map to store indices would improve efficiency.'),
(2, 2, 'I still don’t fully understand how sliding window reduces time complexity.'),
(3, 3, 'Backtracking works well for smaller grids, but it’s slower for larger inputs.');
