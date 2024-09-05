const express = require('express');
const path = require('path');

const app = express();
const port = 9000;

app.use(express.static(path.join(__dirname, 'public')));

app.get("/*", function(req, res, next) {
    next(res.redirect('/404.html'));
});

app.listen(port);