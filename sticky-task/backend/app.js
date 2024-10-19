require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json()); 

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the PostgreSQL database');
  }
});

app.get('/', (req, res) => {
  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result.rows);
  });
});

app.post('/api/sticky', (req, res) => {
  const { content } = req.body;

  pool.query('INSERT INTO sticky_list (content) VALUES ($1) RETURNING *', [content], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(result.rows[0]); 
  });
});

app.get('/api/sticky', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit;
  
    try {
      const result = await pool.query('SELECT * FROM sticky_list LIMIT $1 OFFSET $2', [limit, offset]);
      res.json(result.rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

app.delete('/api/sticky/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM sticky_list WHERE id = $1 RETURNING *', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]); 
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
