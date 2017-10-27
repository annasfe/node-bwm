/*
* SETUP
*/

var express  = require('express');
var app      = express();                   // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var sqlite3 = require('sqlite3');

// db configuration
 var db = new sqlite3.Database('./bwomtest.db');

// server setup 
//app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

/*
* API ROUTES
*/

// get hyped bands
app.get('/', function(req, res) {

 db.serialize(function() {
    db.all("SELECT * FROM habits", function(err, rows) {

        if (err) return console.log(err);
        console.log(JSON.stringify(rows));
        res.send(rows[0].description_en);

    });
  });
});




/*
* FRONTEND ROUTES
*/
/*
app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
*/

/*
* RUN
*/

// Start server
port = 1501;
app.listen(port);
console.log("App listening on port " + port);