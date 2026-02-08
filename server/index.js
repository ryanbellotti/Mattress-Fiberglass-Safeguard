const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Save assessment
app.post('/api/assessment', (req, res) => {
  const { userId, data } = req.body;
  if (!userId || !data) {
    return res.status(400).json({ error: 'userId and data are required' });
  }

  const jsonString = JSON.stringify(data);
  const now = new Date().toISOString();

  // Upsert logic
  const sql = `INSERT INTO assessments (user_id, data, updated_at) VALUES (?, ?, ?)
               ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`;

  db.run(sql, [userId, jsonString, now], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Assessment saved successfully', id: this.lastID });
  });
});

// Get assessment
app.get('/api/assessment/:userId', (req, res) => {
  const { userId } = req.params;

  const sql = 'SELECT data, updated_at FROM assessments WHERE user_id = ?';
  db.get(sql, [userId], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json({ ...JSON.parse(row.data), updatedAt: row.updated_at });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
