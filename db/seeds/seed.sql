 CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS letters (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    opened_at TIMESTAMP,
    letter_text TEXT NOT NULL
);

 INSERT INTO users (username) VALUES 
('John Doe'), 
('Jane Smith');

INSERT INTO letters (user_id, letter_text) VALUES 
(1, 'Welcome to Special Letter!'),
(1, 'Here is your second letter.'),
(2, 'Hello Jane, here is your letter.');
