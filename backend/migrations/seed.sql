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
        'Hello World',
        'Print the string "Hello World!"',
        'hello-world',
        'None',
        'easy',
        2,
        'active',
        'python',
        'print("Hello World!")',
        'Simple print statement'
    ),
    (
        'Sum of Two Numbers',
        'Given two integers A and B, compute A + B',
        'sum-two-numbers',
        '1 ≤ A, B ≤ 1000',
        'easy',
        3,
        'active',
        'cpp',
        '#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}',
        'Basic input/output and arithmetic'
    ),
    (
        'Maximum of Three Numbers',
        'Find the maximum among three integers',
        'max-of-three',
        '-1000 ≤ a, b, c ≤ 1000',
        'easy',
        4,
        'validate',
        'java',
        'import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        System.out.println(Math.max(a, Math.max(b, c)));
    }
}',
        'Using Math.max to find maximum'
    ),
    (
        'FizzBuzz',
        'For numbers 1 to N: print "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of both',
        'fizzbuzz',
        '1 ≤ N ≤ 10^5',
        'medium',
        2,
        'active',
        'go',
        'package main
import "fmt"
func main() {
    var n int
    fmt.Scan(&n)
    for i := 1; i <= n; i++ {
        switch {
        case i%3 == 0 && i%5 == 0:
            fmt.Println("FizzBuzz")
        case i%3 == 0:
            fmt.Println("Fizz")
        case i%5 == 0:
            fmt.Println("Buzz")
        default:
            fmt.Println(i)
        }
    }
}',
        'Loop with modulo checks for divisibility'
    );

-- Problem tags
INSERT INTO
    problem_tags
VALUES (1, 'introduction'),
    (2, 'math'),
    (2, 'io'),
    (3, 'comparison'),
    (4, 'loops'),
    (4, 'conditionals');

-- Problem examples
INSERT INTO
    problem_examples (
        problem_id,
        input,
        expected_output,
        explanation
    )
VALUES (
        1,
        NULL,
        'Hello World!',
        'Basic output'
    ),
    (2, '2 3', '5', '2 + 3 = 5'),
    (
        3,
        '10 20 30',
        '30',
        '30 is maximum'
    ),
    (
        4,
        '5',
        '1\n2\nFizz\n4\nBuzz',
        'First 5 FizzBuzz outputs'
    );

-- Test cases
INSERT INTO
    test_cases (
        problem_id,
        input,
        expected_output
    )
VALUES
    -- Problem 1
    (1, '', 'Hello World!'),
    -- Problem 2
    (2, '0 0', '0'),
    (2, '100 200', '300'),
    (2, '-5 10', '5'),
    -- Problem 3
    (3, '1 2 3', '3'),
    (3, '-1 -5 -3', '-1'),
    (3, '0 0 0', '0'),
    -- Problem 4
    (4, '3', '1\n2\nFizz'),
    (
        4,
        '15',
        '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz'
    );

-- Time/Memory limits (applied to all problems equally)
INSERT INTO
    limits (
        problem_id,
        language,
        time_limit_ms,
        memory_limit_kb
    )
VALUES (1, 'python', 2000, 10240),
    (2, 'cpp', 1000, 10240),
    (3, 'java', 1500, 20480),
    (4, 'go', 1000, 15360);

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
VALUES (
        1,
        'Is this too easy?',
        'Can we make this more challenging?',
        3
    ),
    (
        2,
        'Why java heap space?',
        'Getting memory error with large numbers',
        4
    ),
    (
        4,
        'Optimization needed',
        'My solution times out at N=1e5',
        2
    );

-- Discussion votes
INSERT INTO
    discussion_votes
VALUES (2, 1, 1),
    (3, 1, -1),
    (4, 2, 1),
    (4, 3, 1);

-- Discussion comments
INSERT INTO
    discussion_comments (
        discussion_id,
        author_id,
        content
    )
VALUES (
        1,
        2,
        'This is meant as an introductory problem'
    ),
    (
        1,
        4,
        'I think it serves its purpose'
    ),
    (
        2,
        3,
        'Check for memory leaks in your implementation'
    ),
    (
        3,
        3,
        'Try using string builder'
    );