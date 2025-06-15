CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TYPE problem_status AS ENUM ('draft', 'validate', 'active', 'rejected', 'archieved');

CREATE TYPE submission_status AS ENUM (
    'pending', 'accepted', 'wrong answer', 'time limit exceeded',
    'memory limit exceeded', 'compilation error', 'runtime error'
);

CREATE TYPE contest_status AS ENUM ('waiting', 'running', 'ended', 'cancelled');

CREATE TYPE language AS ENUM ('go', 'python', 'cpp', 'java', 'c');

CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');

CREATE TYPE execution_type AS ENUM ('run', 'submit', 'contest', 'validate');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'user',
    rating INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE,
    constraints TEXT,
    difficulty difficulty NOT NULL,
    author_id INT REFERENCES users (id),
    status problem_status NOT NULL DEFAULT 'draft',
    solution_language language,
    solution_code TEXT,
    failure_reason TEXT
);

CREATE TABLE solved_problems (
    user_id INT REFERENCES users (id),
    problem_id INT NOT NULL,
    solved_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, problem_id),
    FOREIGN KEY (problem_id) REFERENCES problems (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE problem_tags (
    problem_id INT REFERENCES problems (id),
    tag TEXT,
    PRIMARY KEY (problem_id, tag)
);

CREATE TABLE problem_examples (
    id SERIAL PRIMARY KEY,
    problem_id INT REFERENCES problems (id),
    input TEXT,
    expected_output TEXT,
    explanation TEXT
);

CREATE TABLE test_cases (
    id SERIAL PRIMARY KEY,
    problem_id INT REFERENCES problems (id),
    input TEXT,
    expected_output TEXT
);

CREATE TABLE limits (
    problem_id INT REFERENCES problems (id),
    language language,
    time_limit_ms INT CHECK (time_limit_ms > 0),
    memory_limit_kb INT CHECK (memory_limit_kb > 0),
    PRIMARY KEY (problem_id, language)
);

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    problem_id INT REFERENCES problems (id),
    user_id INT REFERENCES users (id),
    contest_id INT,
    language language,
    code TEXT,
    status submission_status,
    message TEXT
);

CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    submission_id INT REFERENCES submissions (id),
    status submission_status,
    stdout TEXT,
    stderr TEXT,
    runtime_ms INT,
    memory_kb INT
);

CREATE TABLE contests (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    status contest_status,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contest_problems (
    contest_id INT REFERENCES contests (id),
    problem_id INT REFERENCES problems (id),
    max_points INT,
    PRIMARY KEY (contest_id, problem_id)
);

CREATE TABLE contest_participants (
    contest_id INT REFERENCES contests (id),
    user_id INT REFERENCES users (id),
    score INT DEFAULT 0,
    rating_change INT DEFAULT 0,
    PRIMARY KEY (contest_id, user_id)
);

CREATE TABLE contest_solved_problems (
    contest_id INT,
    user_id INT,
    problem_id INT,
    solved_at TIMESTAMPTZ,
    score_delta INT,
    PRIMARY KEY (
        contest_id,
        user_id,
        problem_id
    ),
    FOREIGN KEY (contest_id, user_id) REFERENCES contest_participants (contest_id, user_id)
);

CREATE TABLE execution_payloads (
    id SERIAL PRIMARY KEY,
    language language,
    code TEXT,
    time_limit_ms INT,
    memory_limit_kb INT,
    execution_type execution_type,
    points INT,
    penalty INT
);

CREATE TABLE execution_testcases (
    payload_id INT REFERENCES execution_payloads (id),
    testcase_id INT REFERENCES test_cases (id),
    PRIMARY KEY (payload_id, testcase_id)
);

CREATE TABLE execution_responses (
    id SERIAL PRIMARY KEY,
    submission_id INT REFERENCES submissions (id),
    execution_type execution_type,
    score_delta INT
);

CREATE TABLE discussions (
    id SERIAL PRIMARY KEY,
    problem_id INT REFERENCES problems (id),
    title TEXT,
    content TEXT,
    author_id INT REFERENCES users (id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE discussion_votes (
    user_id INT REFERENCES users (id),
    discussion_id INT REFERENCES discussions (id),
    vote INT CHECK (vote IN (-1, 0, 1)),
    PRIMARY KEY (user_id, discussion_id)
);

CREATE TABLE discussion_comments (
    id SERIAL PRIMARY KEY,
    discussion_id INT REFERENCES discussions (id),
    author_id INT REFERENCES users (id),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);