var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv')

dotenv.config({
    path: '.env'
})

var queueRouter = require('./routes/queue');

var app = express();
app.disable('etag');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/queue', queueRouter);
//app.use('/users', usersRouter);

module.exports = app;