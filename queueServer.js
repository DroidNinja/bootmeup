var kue = require('kue');
var express = require('express');
var ui = require('kue-ui');
var cors = require('cors');

// create our job queue

var jobs = kue.createQueue();

// start the UI
ui.setup({
    apiURL: '/api',
    baseURL: '/test',
    updateInterval: 1000
});

var app = express();
app.use(cors());
app.use('/api', kue.app);
app.use('/test', ui.app);

app.listen(3210);
console.log('UI started on port 3000');