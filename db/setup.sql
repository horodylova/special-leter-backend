SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'test_special_letter'
  AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS special_letter;
DROP DATABASE IF EXISTS test_special_letter;

CREATE DATABASE test_special_letter;
CREATE DATABASE special_letter;

\c special_letter

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE letters (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    opened_at TIMESTAMP,
    letter_text TEXT NOT NULL
);

\c test_special_letter

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL  
);

CREATE TABLE letters (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    opened_at TIMESTAMP,
    letter_text TEXT NOT NULL
);

