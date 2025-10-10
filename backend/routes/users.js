const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all users for a specific server
router.get('/server/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    const { rows } = await pool.query('SELECT * FROM users WHERE server_id = $1 ORDER BY created_at DESC', [serverId]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST a new user to a server
router.post('/', async (req, res) => {
  try {
    const {
      account_name, service_type, account_type, expire_date,
      total_devices, data_limit_gb, server_id,
    } = req.body;

    const newUser = await pool.query(
      'INSERT INTO users (account_name, service_type, account_type, expire_date, total_devices, data_limit_gb, server_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [account_name, service_type, account_type, expire_date, total_devices, data_limit_gb, server_id]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW: UPDATE a user ---
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      account_name, service_type, account_type, expire_date,
      total_devices, data_limit_gb,
    } = req.body;
    
    const updatedUser = await pool.query(
      'UPDATE users SET account_name = $1, service_type = $2, account_type = $3, expire_date = $4, total_devices = $5, data_limit_gb = $6 WHERE id = $7 RETURNING *',
      [account_name, service_type, account_type, expire_date, total_devices, data_limit_gb, userId]
    );
    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW: DELETE a user ---
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;