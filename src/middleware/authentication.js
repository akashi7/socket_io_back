const { verify } = require('jsonwebtoken');
const { config } = require("dotenv");

config();


exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
    if (err) res.send({ status: 401 });
    else {
      req.user = decoded;
      next();
    }
  });
};