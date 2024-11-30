import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: 'kestra',
  host: 'localhost',
  database: 'kestra',
  password: 'kestra',
  port: 5432,
});


app.post('/letters', async (req, res) => {
  const { name, text, deliveryDate } = req.body;

  try {
    const { rows } = await pool.query(
      'INSERT INTO letters (name, text, delivery_date, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [name, text, deliveryDate]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save the letter' });
  }
});


app.get('/letters', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM letters ORDER BY delivery_date ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch letters' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
