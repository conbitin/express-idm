var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/idm', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/idm.html'));
});

app.get('*', function(req, res) {
    res.sendStatus(400);
});

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./mydatabase.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
});

app.post('/memsearch/rest/v1/verify/ids/', function(req, res) {
    if(!req.body.ids) return res.sendStatus(400);
    
    singleIds = req.body.ids;
    let sql = 'SELECT * FROM Employees WHERE userId IN (';
    for (i = 0; i < singleIds.length; i++) {
        sql += "'"+ singleIds[i] + "'";
        if (i != singleIds.length - 1)
            sql += ", ";
    }
    sql += ")"

    var result = {"ids":[]};

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
          result["ids"].push(row.userId);
        });
        res.json(result);
    });
    
});

app.listen(3000);