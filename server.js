import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

 const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  
  },
});


app.get('/api', (req, res) => {
  res.status(200).send('Welcome to the Special Letter API!');
});

 
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // Выполняем простой запрос
    res.status(200).json({ message: 'Database connection successful!', time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed!', error: error.message });
  }
});

 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
