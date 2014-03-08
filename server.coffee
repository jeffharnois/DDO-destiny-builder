express = require('express')
app = express.createServer()

app.configure ->
  app.set 'view options', layout: false
  app.register(
    '.html'
    {
      compile: (str, options) ->
        (locals) ->
          str
    }
  )
  @

app.use express.static(__dirname + '/public')

app.get '/', (req, res) ->
  res.render('index.html')

port = 8080
console.log "server listening at port #{port}"

app.listen(port)