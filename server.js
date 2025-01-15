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
  
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');  
    res.status(200).json({ message: 'Database connection successful!', time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed!', error: error.message });
  }
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;

 if (require.main === module) {

  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}