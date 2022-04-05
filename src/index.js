const { json, urlencoded } = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const cors = require("cors");



const app = require('express')();


app.use(cors());


app.use(json());
app.use(urlencoded({ extended: false }));
app.use(require('morgan')('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);



module.exports = app;



