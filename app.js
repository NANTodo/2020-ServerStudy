var express = require('express');
var http = require('http');
var path = require('path');
var static = require('serve-static');
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require('body-parser'); // body-parser를 bodyParser란 변수로 사용
var template = require('./template.js');


const { resolveSoa } = require('dns');
const { Console } = require('console');
const { resolve } = require('url');

var app = express();

//db 연결
var db = mysql.createConnection({
    host:'localhost',
    user:'taster',
    password:'root',
    database:'taste'
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
  });


// 이렇게 하면 public 아래에 있는 부분에 대해서 따로 디렉토리 설정을 하지 않아도 된다.
app.use(static(path.join(__dirname, '/')));


// express에 아래 모듈을 사용하겠다고 호출하는 부분
app.use(bodyParser.json()); // Json Parser
app.use(bodyParser.urlencoded({extended:true}));

// '/'로 들어오면 /public/main.html을 열어준다.
app.get('/', function(req, res) {
    console.log("첫번째화면");
    res.sendFile(path.join(__dirname+'/start.html'));

});



//form의 action 태그에서 result.html이 아닌 result로 했긴 때문에 라우터는 그냥 result로 해야함.
app.get('/result', function(req, res) {
    console.log("두번째화면");

    fs.readFile('./result.html', function(error, data){//이걸로 인해서 main2.html 불러옴. 물론 html form태그에서 action 경로를 해줘야 이동함.
      var input_text = req.query.search;
      var input_split = input_text.split('#');

      db.query('update tagmatch set hit=0',function(err,hit){
        if(err){console.log('error: ',err.message);} //tag를 count한 테이블을 초기화합니다.
      });


      for(var j=1; j<input_split.length; j++){//각 태그에 맞는 경우의 수를 따져 해당 음식에 대한 카운트값을 증가합니다.
      for(var i=1; i<5; i++){
      var sql = `SELECT foodname FROM food WHERE taste`+i+` in (SELECT tcode FROM tag WHERE tname=?)`;
      db.query(sql, [input_split[j]], function(err, result) {
            if(err){console.log('error : ', err.message);}
            else{
                  for(var k=0; k<result.length;k++){//얻어낸 음식 종류를 통한 반복문
                      db.query('update tagmatch set hit=hit+1 where foodname = ?',result[k].foodname,function(err,hit){
                      if(err){console.log('error: ',err.message);}
                    })
                  }
            }
        });
      }
    };
      setTimeout(function(){//놀랍게도, 비동기는 그냥 시간을 주는 걸로 처리해버렸습니다. 코드의 가독성도 살린 셈이죠..
        var sql = 'select foodname from tagmatch order by hit desc limit 1';
        db.query(sql,function(err,food){
          if(err) {
            throw err;
            //console.log('error:',err.message);
          }
            console.log(food[0]);


              var html = template.HTML(food[0].foodname);
              res.send(html);//res 관련된거 미들웨어에 하나만 있어야함. 응답을 보냈는데 또 보내면 이상하잖아.. 라우터개념 이제야 이해했다..



        img_name=food[0].foodname;
      });
    },1000);



     // res.writeHead(200, {'Content-Type': 'text/html'});

      //res.end(data);

  });









});




//서버
app.listen(3000, function() {
    console.log("start!! express server port on 3000!!");
});
