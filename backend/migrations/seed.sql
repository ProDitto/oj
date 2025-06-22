-- Password: "pass_hash" for all users (for testing purposes only)
INSERT INTO
    users (
        username,
        hashed_password,
        email,
        role,
        rating
    )
VALUES (
        'admin',
        'pass_hash',
        'admin@example.com',
        'admin',
        0
    ),
    (
        'alice',
        'pass_hash',
        'alice@example.com',
        'user',
        1234
    ),
    (
        'bob',
        'pass_hash',
        'bob@example.com',
        'user',
        1100
    ),
    (
        'eve',
        'pass_hash',
        'eve@example.com',
        'user',
        950
    );

-- Problems with solution implementations

INSERT INTO
    problems (
        title,
        description,
        slug,
        constraints,
        difficulty,
        author_id,
        status,
        solution_language,
        solution_code,
        explanation
    )
VALUES (
        'Subarray Sum Equals K',
        'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.

A subarray is a contiguous non-empty sequence of elements within an array.

Input Format:
First line contains two space-saperated numbers n and k.
The next line contains n space-saperated numbers

Output Format:
Print a number representing the total number of subarrays.',
        'subarray-sum-equals-k',
        '1 <= nums.length <= 2 * 10^4, -1000 <= nums[i] <= 1000, -10^7 <= k <= 10^7',
        'medium',
        2,
        'active',
        'cpp',
        '<placeholder>',
        'The solution uses the Prefix Sum and Hash Map technique. It keeps a running prefix sum and uses a hash map to store the frequency of each prefix sum encountered. For each index, it checks if the value (current prefix sum minus k) exists in the map. If it does, it adds the count of that value to the result. This efficiently counts all subarrays with sum equal to k in linear time.'
    ),
    (
        'Group Anagrams',
        'Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.\n\nInput Format:\nFirst line contains an integer n, the number of strings.\nNext line contains n space-separated strings.\n\nOutput Format:\nPrint the groups of anagrams as lists of strings.',
        'group-anagrams',
        '1 <= strs.length <= 10^4, 0 <= strs[i].length <= 100, strs[i] consists of lowercase English letters.',
        'medium',
        2,
        'active',
        'cpp',
        '<placeholder>',
        'The solution sorts each string to generate a key and groups strings with the same sorted key using a hash map. This groups all anagrams together efficiently, achieving average linear time complexity relative to the total number of characters.'
    ),
    (
        'Median of Two Sorted Arrays',
        'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).\n\nInput Format:\nFirst line contains two integers m and n.\nSecond line contains m space-separated integers representing nums1.\nThird line contains n space-separated integers representing nums2.\n\nOutput Format:\nPrint a single number representing the median of the combined sorted arrays.',
        'median-of-two-sorted-arrays',
        '0 <= m, n <= 1000, -10^6 <= nums1[i], nums2[i] <= 10^6',
        'hard',
        2,
        'active',
        'cpp',
        '<placeholder>',
        'The solution uses a binary search approach to partition the two arrays so that the left and right halves combined represent the median position. By adjusting the partition indices, it finds the correct median in O(log(min(m, n))) time.'
    ),
    (
        'Maximum Subarray (Classic Kadane’s)',
        'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nInput Format:\nFirst line contains an integer n representing the number of elements.\nThe next line contains n space-separated integers representing the array nums.\n\nOutput Format:\nPrint a single integer representing the largest sum of a contiguous subarray.',
        'maximum-subarray-classic-kadanes',
        '1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4',
        'easy',
        2,
        'active',
        'cpp',
        '<placeholder>',
        'The solution uses Kadanes Algorithm which iterates through the array while keeping track of the current maximum subarray sum ending at the current position and the global maximum subarray sum found so far. This approach runs in linear time.'
    );

-- Problem tags
INSERT INTO
    problem_tags
VALUES (1, 'array'),
    (1, 'hashmap'),
    (1, 'prefix-sum'),
    (2, 'hashmap'),
    (2, 'string'),
    (2, 'sorting'),
    (3, 'array'),
    (3, 'binary_search'),
    (3, 'divide_conquer'),
    (4, 'array'),
    (4, 'dynamic_programming'),
    (4, 'greedy');

-- Problem examples
INSERT INTO
    problem_examples (
        problem_id,
        input,
        expected_output,
        explanation
    )
VALUES
    -- Problem 1: Subarray Sum (input: n+k on first line, array on second)
    (
        1,
        '3 2' || E'\n' || '1 1 1',
        '2',
        'Subarrays: [1,1] at indices 0-1 and [1,1] at indices 1-2'
    ),
    (
        1,
        '4 0' || E'\n' || '1 -1 1 -1',
        '4',
        'Subarrays: [1,-1], [-1,1], and two more'
    ),
    -- Problem 2: Group Anagrams (input: n on first line, strings on second)
    (
        2,
        '3' || E'\n' || 'eat tea ate',
        'ate eat tea',
        'All belong to the same anagram group'
    ),
    (
        2,
        '4' || E'\n' || 'bat tan rat nat',
        'bat' || E'\n' || 'nat tan' || E'\n' || 'rat',
        'Three separate anagram groups'
    ),
    -- Problem 3: Median of Arrays (input: m+n, then array1, then array2)
    (
        3,
        '2 1' || E'\n' || '1 3' || E'\n' || '2',
        '2',
        'Merged array: [1,2,3] → median=2'
    ),
    (
        3,
        '2 2' || E'\n' || '1 2' || E'\n' || '3 4',
        '2.5',
        'Merged array: [1,2,3,4] → median=2.5'
    ),
    -- Problem 4: Maximum Subarray (input: n on first line, array on second)
    (
        4,
        '9' || E'\n' || '-2 1 -3 4 -1 2 1 -5 4',
        '6',
        'Maximum subarray: [4,-1,2,1] = 6'
    ),
    (
        4,
        '1' || E'\n' || '-50',
        '-50',
        'Single element array'
    );

-- Test cases
INSERT INTO
    test_cases (
        problem_id,
        input,
        expected_output
    )
VALUES
    -- Problem 1 test cases
    (1, '1 0' || E'\n' || '0', '1'),
    (
        1,
        '3 3' || E'\n' || '1 2 3',
        '2'
    ),
    (
        1,
        '5 3' || E'\n' || '1 2 1 2 3',
        '4'
    ),
    (
        1,
        '3 0' || E'\n' || '1 -1 0',
        '3'
    ),
    (
        1,
        '2 2' || E'\n' || '1 -1',
        '0'
    ),
    -- Problem 2 test cases
    (2, '0' || E'\n' || '', ''),
    (
        2,
        '1' || E'\n' || 'abc',
        'abc'
    ),
    (
        2,
        '3' || E'\n' || 'bat tab abt',
        'abt bat tab'
    ),
    (
        2,
        '4' || E'\n' || 'stop post pots spot',
        'post pots spot stop'
    ),
    (
        2,
        '5' || E'\n' || 'a b c d e',
        'a' || E'\n' || 'b' || E'\n' || 'c' || E'\n' || 'd' || E'\n' || 'e'
    ),
    -- Problem 3 test cases
    (
        3,
        '0 1' || E'\n' || '' || E'\n' || '10',
        '10.0'
    ),
    (
        3,
        '1 0' || E'\n' || '5' || E'\n' || '',
        '5.0'
    ),
    (
        3,
        '2 2' || E'\n' || '1 3' || E'\n' || '2 4',
        '2.5'
    ),
    (
        3,
        '1 1' || E'\n' || '4' || E'\n' || '5',
        '4.5'
    ),
    (
        3,
        '4 5' || E'\n' || '1 3 5 7' || E'\n' || '2 4 6 8 10',
        '5.0'
    ),
    -- Problem 4 test cases
    (
        4,
        '3' || E'\n' || '-1 -2 -3',
        '-1'
    ),
    (
        4,
        '5' || E'\n' || '1 2 -5 3 4',
        '7'
    ),
    (
        4,
        '5' || E'\n' || '-1 2 -1 4 -1',
        '5'
    ),
    (
        4,
        '6' || E'\n' || '1 -2 2 -1 3 -4',
        '4'
    ),
    (
        4,
        '3' || E'\n' || '10 -20 5',
        '10'
    );

-- Time/Memory limits (applied to all problems equally)
INSERT INTO
    limits (
        problem_id,
        language,
        time_limit_ms,
        memory_limit_kb
    )
    -- Problem 1: Medium
VALUES (1, 'go', 1000, 12288),
    (1, 'python', 2000, 16384),
    (1, 'cpp', 1000, 12288),
    (1, 'java', 2000, 16384),
    (1, 'c', 1000, 12288),
    -- Problem 2: Medium
    (2, 'go', 1000, 14336),
    (2, 'python', 2000, 20480),
    (2, 'cpp', 1000, 14336),
    (2, 'java', 2000, 20480),
    (2, 'c', 1000, 14336),
    -- Problem 3: Hard
    (3, 'go', 3000, 22528),
    (3, 'python', 4000, 26624),
    (3, 'cpp', 3000, 22528),
    (3, 'java', 4000, 26624),
    (3, 'c', 3000, 22528),
    -- Problem 4: Easy
    (4, 'go', 500, 8192),
    (4, 'python', 1500, 12288),
    (4, 'cpp', 500, 8192),
    (4, 'java', 1500, 12288),
    (4, 'c', 500, 8192);

-- Submissions with results
INSERT INTO
    submissions (
        problem_id,
        user_id,
        language,
        code,
        status
    )
VALUES (
        1,
        2,
        'python',
        'print("Hello World!")',
        'accepted'
    ),
    (
        2,
        3,
        'cpp',
        '#include <iostream>\nusing namespace std;\nint main() { int a,b; cin>>a>>b; cout<<a+b; }',
        'wrong answer'
    ), -- Missing newline
    (
        2,
        2,
        'python',
        'a = int(input())\nb = int(input())\nprint(a+b)',
        'accepted'
    ),
    (
        3,
        4,
        'java',
        'import java.util.*;\npublic class Main {\npublic static void main(String[] args) {\nScanner sc=new Scanner(System.in);\nSystem.out.println(sc.nextInt());}}',
        'wrong answer'
    );

-- Test results for submissions
INSERT INTO
    test_results (
        submission_id,
        status,
        stdout,
        stderr,
        runtime_ms,
        memory_kb
    )
VALUES (
        1,
        'accepted',
        'Hello World!',
        '',
        10,
        1500
    ),
    (
        2,
        'wrong answer',
        '5',
        '',
        5,
        2500
    ),
    (
        3,
        'accepted',
        '5',
        '',
        20,
        3500
    ),
    (
        4,
        'wrong answer',
        '10',
        '',
        40,
        4800
    );

-- Contests
INSERT INTO
    contests (
        name,
        status,
        start_time,
        end_time
    )
VALUES (
        'Intro Contest',
        'ended',
        '2023-01-01 12:00:00',
        '2023-01-01 15:00:00'
    ),
    (
        'Advanced Challenges',
        'waiting',
        '2024-01-01 12:00:00',
        '2024-01-02 12:00:00'
    );

-- Contest problems
INSERT INTO
    contest_problems
VALUES (1, 1, 100),
    (1, 2, 200),
    (2, 3, 150),
    (2, 4, 250);

-- Contest participants
INSERT INTO
    contest_participants (contest_id, user_id, score)
VALUES (1, 2, 300),
    (1, 3, 200),
    (1, 4, 0),
    (2, 2, 0),
    (2, 3, 0);

-- Solved problems (both contest and regular)
INSERT INTO
    solved_problems (user_id, problem_id)
VALUES (2, 1),
    (2, 2),
    (3, 2);

-- Contest solved problems
INSERT INTO
    contest_solved_problems (
        contest_id,
        user_id,
        problem_id,
        solved_at,
        score_delta
    )
VALUES (
        1,
        2,
        1,
        '2023-01-01 12:30:00',
        100
    ),
    (
        1,
        2,
        2,
        '2023-01-01 13:15:00',
        200
    ),
    (
        1,
        3,
        2,
        '2023-01-01 13:45:00',
        200
    );

-- Discussions
INSERT INTO
    discussions (
        problem_id,
        title,
        content,
        author_id
    )
VALUES
    -- Problem 1 Discussions
    (
        1,
        'Handling negative numbers in Subarray Sum',
        'My solution works for positives but fails with negative numbers. How should I modify the prefix sum approach?',
        3 -- bob
    ),
    (
        1,
        'Edge case: Large k value causing overflow',
        'My solution fails for k=10,000,000 with larger arrays. Should we be concerned about integer overflow?',
        4 -- eve
    ),
    -- Problem 2 Discussions
    (
        2,
        'Efficiency concerns with sorting',
        'Is sorting every string O(n * m log m) efficient for large inputs?',
        2 -- alice
    ),
    (
        2,
        'Output format confusion',
        'The judge expects groups separated by newlines, but in my result, the groups themselves are separated by spaces?',
        4 -- eve
    ),
    -- Problem 3 Discussions
    (
        3,
        'Binary search partitioning confusion',
        'I''m struggling with the binary search partitioning step. How do we know which direction to adjust?',
        3 -- bob
    ),
    (
        3,
        'Handling array size disparities',
        'Why does the solution handle the smaller array first? What''s the reason behind min(m,n)?',
        2 -- alice
    ),
    -- Problem 4 Discussions
    (
        4,
        'Kadane vs dividing for negative-only arrays',
        'My code returns 0 for all-negative arrays with Kadane, but expected to return max negative',
        4 -- eve
    ),
    (
        4,
        'Linear time vs divide and conquer approaches',
        'Can we solve Maximum Subarray with O(n) using divide and conquer?',
        3 -- bob
    );

-- Discussion votes
INSERT INTO
    discussion_votes (user_id, discussion_id, vote)
VALUES
    -- Votes for Problem 1 discussions
    (2, 1, -1), -- alice
    (4, 1, 1), -- eve
    (1, 1, 1), -- admin
    (2, 2, 1),
    (3, 2, -1),
    (4, 2, 1),
    -- Votes for Problem 2 discussions
    (3, 3, 1),
    (4, 3, 1),
    (1, 3, -1),
    (2, 4, 1),
    (3, 4, 0),
    (4, 4, -1),
    -- Votes for Problem 3 discussions
    (2, 5, 1),
    (4, 5, 1),
    (1, 5, 1),
    (2, 6, -1),
    (3, 6, 1),
    (4, 6, 1),
    -- Votes for Problem 4 discussions
    (2, 7, 1),
    (3, 7, -1),
    (4, 7, 1),
    (2, 8, 0),
    (3, 8, 1),
    (1, 8, 1);

-- Discussion comments
INSERT INTO
    discussion_comments (
        discussion_id,
        author_id,
        content
    )
VALUES
    -- Comments for Problem 1 discussions
    (
        1,
        2, -- alice
        'You need to account for negative prefix sums in your map. The prefix sum formula still works as (current_sum - k) could be negative'
    ),
    (
        1,
        4, -- eve
        'This solved it for me: Initialize your prefix sum map with {0:1} to handle subarrays starting at index 0'
    ),
    (
        1,
        1, -- admin
        'Always initialize the prefix sum with an entry for 0 before processing the first element'
    ),
    -- Comments for Problem 2 discussions
    (
        4,
        3, -- bob
        'For large inputs, consider using frequency arrays instead of sorting. Count character frequencies to generate keys'
    ),
    (
        4,
        2, -- alice
        'The problem expects the strings in any order per group, but groups themselves should be on separate lines'
    ),
    (
        4,
        4, -- eve
        'In C++, you can use std::array<int, 26> as a key for O(m) per string instead of O(m log m)'
    ),
    -- Comments for Problem 3 discussions
    (
        5,
        2, -- alice
        'Ensure the left partition has size (m + n + 1)/2, then adjust low/high until maxLeftX <= minRightY and maxLeftY <= minRightX'
    ),
    (
        5,
        1, -- admin
        'Important edge case: When one array is completely less than the other, check partition X = m'
    ),
    (
        5,
        4, -- eve
        'Heres a visualization tool that helped me: https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/'
    ),
    (
        6,
        3, -- bob
        'The complexity depends on min(m,n) because we only binary search on the smaller array to optimize O(log(min(m,n)))'
    ),
    -- Comments for Problem 4 discussions
    (
        7,
        2, -- alice
        'Modify Kadane to initialize current_max = nums[0] instead of 0, and let global_max = nums[0]'
    ),
    (
        7,
        3, -- bob
        'Yes, classic Kadane needs modification for negatives. Use: current_max = max(nums[i], current_max + nums[i])'
    ),
    (
        8,
        4, -- eve
        'While divide and conquer is O(n log n), Kadanes linear is optimal. The classic O(n) solution can''t be beat'
    ),
    (
        8,
        1, -- admin
        'Divide and conquer would be overkill here. The linear DP solution is optimal and simpler'
    );