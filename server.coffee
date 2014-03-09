express = require('express')
app = express()

app.configure ->
  app.set 'view options', layout: false

  console.log "app",app

  app.engine(
    '.html', ->
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
