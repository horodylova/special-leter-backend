const express = require('express');
const cors = require('cors');
const pool = require ('./db/connection.js');

const userRouter = require ("./routes/userRoute.js")

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.status(200).send('Welcome to the Special Letter API!');
});

app.use('/api/users', userRouter)
 
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');  
    res.status(200).json({ message: 'Database connection successful!', time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed!', error: error.message });
  }
});

 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
