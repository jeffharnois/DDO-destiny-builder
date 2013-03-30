var express = require('express'),
    app = express.createServer(),
    dist = 'release';

app.configure(function(){
  app.set("view options", {layout: false});
  app.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  });
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render("index.html");
});

console.log('server listening at port 8080');

app.listen(8080);