Special Letter - Backend

A website for saving letters to your future self. This is its backend.

You write a letter and set a date when you’d like to read it—whether in 5 or 10 years. Until then, the letter cannot be opened or deleted. The system will unlock it on the chosen date.

🌐 Website

Special Letter

🚀 Getting Started

First Start (Setup & Seed Databases)

npm run setup-dbs
npm run seed

Next Start (Run the Application)

npm start
npm run dev
npm run test

🛠 Working with SQL

Connect to the database and explore tables:

psql -U postgres -d special_letter
psql -U postgres -d test_special_letter

List tables:

\d
\d users
\q

🔥 API Endpoints (Postman)

Authentication

Login: GET http://localhost:3001/api/auth/login

Register: POST http://localhost:3001/api/auth/register

Logout: POST http://localhost:3001/api/auth/logout

Authorization: Bearer your_jwt_token

🔍 Checking Active Port

Find and kill process using port 3001:

lsof -i :3001
kill -9 <PID>

📜 API Documentation (Swagger)

Swagger Docs

🐳 Running with Docker

docker-compose down
docker-compose up --build

Database Test

curl http://localhost:3000/api/test-db

Accessing Docker Container

docker exec -it special_letter_backend sh

📜 Scripts (package.json)

"scripts": {
    "test": "jest",
    "start": "node server.js",
    "seed-prod": "NODE_ENV=production node ./db/seeds/seed.js",
    "dev": "nodemon server.js",
    "seed": "node db/seeds/seed.js",
    "setup-dbs": "psql -U postgres -d postgres -f ./db/setup.sql",
    "start-db": "psql -U postgres -d special_letter",
    "test-dns": "node test-dns.js"
  }

📦 Dependencies

Main Dependencies

{
  "bcrypt": "^5.1.1",
  "body-parser": "^1.20.3",
  "cors": "^2.8.5",
  "crypto": "^1.0.1",
  "dotenv": "^16.4.7",
  "dotenv-cli": "^7.4.4",
  "express": "^4.21.1",
  "jsonwebtoken": "^9.0.2",
  "kest": "^1.1.5",
  "pg": "^8.13.1",
  "supertest": "^7.0.0"
}

Dev Dependencies

{
  "@babel/core": "^7.26.0",
  "@babel/preset-env": "^7.26.0",
  "babel-jest": "^29.7.0",
  "jest": "^29.7.0"
}

📌 Notes

Ensure PostgreSQL is running before starting the application.

API tests can be performed with Postman or cURL.

Docker setup simplifies deployment and development.

Use Swagger for API documentation and testing.

📝 Author: Svitlana Horodylova

