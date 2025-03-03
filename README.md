# Special Letter - Backend

A website for saving letters to your future self. This is its backend.

You write a letter and set a date when you'd like to read it—whether in 5 or 10 years. Until then, the letter cannot be opened or deleted. The system will unlock it on the chosen date.

## 🌐 Links
- **Website**: [Special Letter](https://special-letter-theta.vercel.app/)
- **Frontend Repository**: [Special Letter Frontend](https://github.com/horodylova/special-letter)

## 🔐 Encryption Process

Special Letter uses encryption to ensure your messages remain private until their scheduled opening date:

1. **Encryption**: When a user submits a letter, the backend encrypts the content using a 32-character key stored securely in environment variables.
   ```javascript
   
   const crypto = require('crypto');
   
function encryptText(text) {
  try {
     const iv = crypto.randomBytes(16);
     const cipher = crypto.createCipheriv(
      ENCRYPTION_ALGORITHM, 
      Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), 
      iv
    );
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt letter text');
  }
}
   ```

2. **Storage**: The encrypted text and initialization vector (IV) are stored in the database, keeping the content secure even if someone gains database access.

This ensures that letters remain private and can only be read when the specified date arrives.

## 🚀 Getting Started

### First Start (Setup & Seed Databases)
```
npm run setup-dbs
npm run seed
```

### Next Start (Run the Application)
```
npm start
npm run dev
npm run test
```

## 🛠 Working with SQL

Connect to the database and explore tables:
```
psql -U postgres -d special_letter
psql -U postgres -d test_special_letter
```

List tables:
```
\d
\d users
\q
```

## 🔥 API Endpoints (Postman)

### Authentication
- Login: `GET http://localhost:3001/api/auth/login`
- Register: `POST http://localhost:3001/api/auth/register`
- Logout: `POST http://localhost:3001/api/auth/logout`

Authorization: `Bearer your_jwt_token`

## 🔍 Checking Active Port

Find and kill process using port 3001:
```
lsof -i :3001
kill -9 <PID>
```

## 📜 API Documentation (Swagger)
[Swagger Docs](http://localhost:3001/api-docs)

## 🐳 Running with Docker

```
docker-compose down
docker-compose up --build
```

### Database Test
```
curl http://localhost:3000/api/test-db
```

### Accessing Docker Container
```
docker exec -it special_letter_backend sh
```

## 📜 Scripts (package.json)

```json
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
```

## 📦 Dependencies

### Main Dependencies
```json
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
```

### Dev Dependencies
```json
{
  "@babel/core": "^7.26.0",
  "@babel/preset-env": "^7.26.0",
  "babel-jest": "^29.7.0",
  "jest": "^29.7.0"
}
```

## 📌 Notes

- Ensure PostgreSQL is running before starting the application.
- API tests can be performed with Postman or cURL.
- Docker setup simplifies deployment and development.
- Use Swagger for API documentation and testing.

## 📝 Author: Svitlana Horodylova
