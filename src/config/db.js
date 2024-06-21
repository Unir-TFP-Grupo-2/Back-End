const mysql = require("mysql2");
require("dotenv").config();
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // Aumenta el tiempo de espera a 10 segundos
});

global.db = pool.promise();

// Verificar la conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error al conectarse a la base de datos:", err.message);
  } else {
    console.log("Base de datos conectada");
    connection.release();
  }
});

module.exports = pool.promise();
