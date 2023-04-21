var path = require('path');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const requestIp = require('request-ip');
const hostname = '127.0.0.1'
const port = 3000;

app.use('/js', express.static(path.join(__dirname, '/js')));
app.use('/css', express.static(path.join(__dirname, '/css')));
app.use('/img', express.static(path.join(__dirname, '/img')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req,res) => {
    res.render('index');
});