// models/db.js
const sql = require('mssql');
const config = require('../config/dbConfig');

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

pool.on('error', err => {
    console.error('SQL Pool Error:', err);
});

module.exports = {
    sql,
    pool,
    poolConnect
};
