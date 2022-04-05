const { db } = require('../config/database');
const { hash, compare } = require("bcryptjs");
const { sign } = require('jsonwebtoken');
const { config } = require("dotenv");

config();

exports.Register = async (req, res) => {
  const { email, password, username } = req.body;

  db.getConnection((err, connection) => {
    if (err) {
      console.log("ConnectionError", err);
    }
    else {
      connection.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
        if (err) console.log("Error", err);
        else if (result.length > 0) {
          res.send({
            status: 205,
            message: "user exist"
          });
        }
        else {
          let hashedPassword = await hash(password, 8);
          connection.query("INSERT INTO users SET?", {
            email,
            password: hashedPassword,
            username
          }, (err, results) => {
            if (err) console.log("Error", err);
            else {
              res.send({
                status: 200,
              });
            }
            connection.release();
          });
        }
      });
    }

  });
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  db.getConnection((err, connection) => {
    if (err) console.log("ConnectionError", err);
    else {
      connection.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
        if (err) console.log("ConnectionError", err);
        else if (result.length < 1) {
          res.send({
            status: 203,
            message: "USER do not exist"
          });
        }
        else if (!(await compare(password, result[0].password))) {
          res.send({
            status: 205,
            message: "WRONG password"
          });
        }
        else {
          const { id, username } = result[0];
          const token = sign({ id, email, username }, process.env.JWT_SECRET, { expiresIn: '24h' });
          res.send({
            status: 200,
            token
          });
        }
        connection.release();
      });
    }
  });
};