redis = require 'redis'
http = require('http').createServer()
socketio = require('socket.io')


settings =
  port: 6000
  redis: 'redis://localhost:6379'


liquidFluxProxy =
  io: null

  listen: ->
    @connectToBackend()

  connectToBackend: ->
    @redis = redis.createClient(settings.redis)
    @redis.on "error", (err) ->
      console.log "Error #{err}"
    @redis.on "ready", @openSocketIO

  openSocketIO: ->
    @io = socketio(http)
    server = http.listen settings.port, =>
      console.log 'yo'
      @io.on 'connection', (socket) =>
        console.log 'new connection'
        @socket.on 'request', @handleRequest


  handleRequest: (header, body) ->
    console.log header, body





liquidFluxProxy.listen()
