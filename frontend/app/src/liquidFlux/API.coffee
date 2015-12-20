liquidFlux = require './index'
Logger = require('./Logger')('API')

class API
  socket: null
  sessionId: null
  header: {}
  _packetIds: {}
  _updateHandlers: {}

  constructor: (url) ->
    keys = ['GET', 'POST', 'DELETE']
    @socket = io(url)
    @socket.on 'connect', =>

      @sessionId = @_genRandomId(true) unless @sessionId
      Logger.log "sessionId: #{@sessionId}"
      @socket.emit 'session', @sessionId
      @socket.emit 'header', @header

      for key in keys
        @socket.on key+'.OK', @processPacketOK
        @socket.on key+'.ERROR', @processPacketERROR
      @socket.on 'UPDATE', @processPacketUPDATE

  processPacketOK: (args...) =>
    @_packetIds[args[2]].fulfill args[1] if args[2] and @_packetIds[args[2]]

  processPacketERROR: (args...) =>
    Logger.error "Error #{args[1].code}#{(if args[1].message then ": '#{args[1].message}'" else '')} <= #{args[0]}"
    @_packetIds[args[2]].reject args[1] if args[2] and @_packetIds[args[2]]

  processPacketUPDATE: (args...) =>
    return unless @_updateHandlers[args[0]]
    cb(args[1]) for cb in @_updateHandlers[args[0]]

  get: (path, onChange) -> new Promise (fulfill, reject) =>
    Logger.log "GET #{path}"
    id = @_genRandomId()
    if onChange
      @_updateHandlers[path] = [] unless @_updateHandlers[path]
      @_updateHandlers[path].push onChange
    @_packetIds[id] =
      fulfill: fulfill
      reject: reject
    @socket.emit 'GET', path, null, id

  post: (path, args) -> new Promise (fulfill, reject) =>
    Logger.log "POST #{path}"
    id = @_genRandomId()
    @_packetIds[id] =
      fulfill: fulfill
      reject: reject
    @socket.emit 'POST', path, args, id


  delete: (path, args) -> new Promise (fulfill, reject) =>
    Logger.log "DELETE #{path}"
    id = @_genRandomId()
    @_packetIds[id] =
      fulfill: fulfill
      reject: reject
    @socket.emit 'DELETE', path, args, id

  _genRandomId: (strong) ->
    if strong
      res = ''
      buf = new Uint8Array(16)
      window.crypto.getRandomValues buf
      res += number.toString(16) for number in buf
      return res
    else
      res = ''
      res += Math.round(Math.random()*15).toString(16) for i in [0...16]
      return res

module.exports = API
