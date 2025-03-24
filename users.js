const express = require('express');
const router = express.Router();
const { Pool } = require("pg");



// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// 🔹 Dummy users data
const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
];

// ✅ GET all users from PostgreSQL
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Users'); // Adjust column names
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ✅ GET user by ID from PostgreSQL
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, role FROM Users WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ✅ POST - Add New User
router.post('/add', async (req, res) => {
    const {id, username, password, role } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Users (id,username, password, role) VALUES ($1, $2, $3,$4) RETURNING *',
            [id,username, password, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      await pool.query('DELETE FROM Users WHERE id = $1', [userId]);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Error deleting user' });
    }
  });
  

// ✅ Export the router
module.exports = router;
