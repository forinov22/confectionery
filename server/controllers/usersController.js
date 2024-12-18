const pool = require('../config/db');

exports.getUsers = async (req, res) => {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
};