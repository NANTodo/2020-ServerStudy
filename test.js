var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');                           

var app = http.createServer(function(request,response){
  var _url = request.url;
  var pathname = url.parse(_url, true).pathname;
  if(request.method==="POST"){                             
    var body='';                                          

    request.on('data', function(data){                    
      body += data;
    });
    request.on('end', function(){                          
      var post = qs.parse(body);                           
      console.log(post);                                  
    }); 
  }

  if(fs.existsSync(__dirname+pathname)){
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname+pathname));
  }
});
app.listen(3000);