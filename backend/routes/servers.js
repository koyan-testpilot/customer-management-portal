const express = require('express');
const router = express.Router();
const pool = require('../db'); // Imports the database connection pool

// GET all servers
router.get('/', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT * FROM servers ORDER BY created_at DESC');
    
    // --- DEBUG LOG ---
    console.log('[DEBUG] Database query result:', dbResult); 
    
    res.json(dbResult.rows); // The error is likely happening here
  } catch (err) {
    console.error('SERVER ROUTE ERROR:', err); // Added a more specific log
    res.status(500).send('Server Error');
  }
});

// POST a new server
router.post('/', async (req, res) => {
  //... (no changes to the rest of the file)
  try {
    const { server_name, owner, service_type, ip_address, domain_name } = req.body;
    const newServer = await pool.query(
      'INSERT INTO servers (server_name, owner, service_type, ip_address, domain_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [server_name, owner, service_type, ip_address, domain_name]
    );
    res.status(201).json(newServer.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// UPDATE a server
router.put('/:id', async (req, res) => {
  //... (no changes to the rest of the file)
  try {
    const { id } = req.params;
    const { server_name, owner, service_type, ip_address, domain_name } = req.body;
    const updatedServer = await pool.query(
      'UPDATE servers SET server_name = $1, owner = $2, service_type = $3, ip_address = $4, domain_name = $5 WHERE id = $6 RETURNING *',
      [server_name, owner, service_type, ip_address, domain_name, id]
    );
    res.json(updatedServer.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a server
router.delete('/:id', async (req, res) => {
  //... (no changes to the rest of the file)
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM servers WHERE id = $1', [id]);
    res.json({ msg: 'Server deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET a single server by ID
router.get('/:id', async (req, res) => {
    //... (no changes to the rest of the file)
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM servers WHERE id = $1', [id]);
    res.json(rows[0]); // Return the first (and only) row
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;