const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

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
    const result = await pool.query(
      'INSERT INTO letters (name, text, delivery_date, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [name, text, deliveryDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save the letter' });
  }
});

 
app.get('/letters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM letters ORDER BY delivery_date ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch letters' });
  }
});

 
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
