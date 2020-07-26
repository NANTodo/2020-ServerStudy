var fs = require('fs');
var ejs = require('ejs');
var http = require('http');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = mysql.createConnection({
  host: 'localhost',
  user: 'taster',
  password: 'root',
  database: 'taste'
});


http.createServer(app).listen(8080, function(){
  console.log('Server running at http://localhost:8080');
});

app.get( '/', function(req, res){

	fs.readFile('list.html', 'utf8', function(error, data){
		if(error){
			console.log('readFile Error');
		}else{
			db.query('select * from tastetag', function(error, results){
				if(error){
					console.log('error : ', error.message);
				}else{
					res.send( ejs.render(data, {
						list : results
					}));
          db.release();
				}
			});
		}
	})
});
