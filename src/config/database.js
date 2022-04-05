const { createPool } = require('mysql');
const { config } = require("dotenv");

config();

const db = createPool({
  host: "localhost",
  database: 'tracker',
  user: 'root',
  password: 'Akashikabuto7'
});


module.exports = { db };