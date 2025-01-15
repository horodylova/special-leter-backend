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

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Incoming request: ${req.method} ${req.url}`);
  next();
});


app.use('/api/auth', authRouter)
app.use('/api/letters', lettersRouter)
  

//some tests for Render

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected:", result.rows[0]);
    res.status(200).json({ message: "Database connected", time: result.rows[0] });
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(500).json({ message: "Database connection failed", error: error.message });
  }
});

const dns = require("dns");

app.get('/api/test-dns', (req, res) => {
  dns.lookup('db.zdyhayhguzfcjuilwnua.supabase.co', (err, address, family) => {
    if (err) {
      console.error("DNS Lookup Error:", err.message);
      res.status(500).json({ message: "DNS Lookup Failed", error: err.message });
    } else {
      console.log("Supabase Host Address:", address, "Family:", family);
      res.status(200).json({ address, family });
    }
  });
});


app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;

if (require.main === module) {
  const PORT = 3001;
  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
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
}