-- migration_clear_schema.sql

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS discussion_comments;
DROP TABLE IF EXISTS discussion_votes;
DROP TABLE IF EXISTS discussions;
DROP TABLE IF EXISTS execution_responses;
DROP TABLE IF EXISTS execution_testcases;
DROP TABLE IF EXISTS execution_payloads;
DROP TABLE IF EXISTS contest_solved_problems;
DROP TABLE IF EXISTS contest_participants;
DROP TABLE IF EXISTS contest_problems;
DROP TABLE IF EXISTS contests;
DROP TABLE IF EXISTS test_results;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS limits;
DROP TABLE IF EXISTS test_cases;
DROP TABLE IF EXISTS problem_examples;
DROP TABLE IF EXISTS problem_tags;
DROP TABLE IF EXISTS solved_problems;
DROP TABLE IF EXISTS problems;
DROP TABLE IF EXISTS users;

-- Drop custom enum types
DROP TYPE IF EXISTS execution_type;
DROP TYPE IF EXISTS difficulty;
DROP TYPE IF EXISTS language;
DROP TYPE IF EXISTS contest_status;
DROP TYPE IF EXISTS submission_status;
DROP TYPE IF EXISTS problem_status;
DROP TYPE IF EXISTS user_role;
