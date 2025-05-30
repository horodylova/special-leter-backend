const express = require('express');
const cors = require('cors');
const pool = require ('./db/connection.js');

const authRouter = require("./routes/authRouter.js")
const lettersRouter = require("./routes/lettersRouter.js")
 
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.status(200).send('Welcome to the Special Letter API!');
});

 
app.use('/api/auth', authRouter)
app.use('/api/letters', lettersRouter)
  

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3001; 
  const server = app.listen(PORT, '0.0.0.0', () => { 
    console.log(`Server is running on http://localhost:${PORT} (or ${PORT} on 0.0.0.0 in production)`);
  });

  process.on("SIGTERM", () => {
    console.log("Shutting down server...");
    server.close(() => {
      pool.end(() => {
        console.log("Database pool has ended.");
        process.exit(0);
      });
    });
  });

  process.on("SIGINT", () => { 
    console.log("Shutting down server...");
    server.close(() => {
      pool.end(() => {
        console.log("Database pool has ended.");
        process.exit(0);
      });
    });
  });
}