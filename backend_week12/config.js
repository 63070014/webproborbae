const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '31.220.110.101',
  user: 'u350327849_phufa',
  password: 'Pf10100667',
  database: 'u350327849_lab_webpro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;