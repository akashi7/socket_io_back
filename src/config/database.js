const { createPool } = require('mysql');
const { config } = require("dotenv");

config();

const db = createPool({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD
});


module.exports = { db };