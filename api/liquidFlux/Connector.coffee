http = require('http').createServer()
socketio = require('socket.io')
Router = require './Router'
Request = require './Request'
Logger = require('./Logger')('Connector')

module.exports = Connector =
  clearingTimeout: 2 # in s

  io: null
  sessions: {}

  # start socket.io-Server
  listen: (port) ->
    @io = socketio(http)
    server = http.listen port, =>
      @io.on 'connection', @registerEventsOnSocket.bind(@)
      Logger.log "Listening on port #{port}..."


  # register event handler on new socket
  registerEventsOnSocket: (socket) ->
    Logger.log "new socket opened"

    # wait for initialising 'session' packet
    socket.once 'session', (sessionId) =>

      # manage sessions
      if @sessions[sessionId]
        Logger.log "Session '#{sessionId}' reconnected"
        @sessions[sessionId].socket = socket
        socket.session = @sessions[sessionId]
        if socket.session.timeout
          clearTimeout(socket.session.timeout)
          delete socket.session.timeout
      else
        Logger.log "new session '#{sessionId}'"
        @sessions[sessionId] =
          socket: socket
          sessionId: sessionId
        socket.session = @sessions[sessionId]

      # bind other packet types
      socket.on 'GET', @getHandler(@sessions[sessionId], 'GET')
      socket.on 'POST', @getHandler(@sessions[sessionId], 'POST')
      socket.on 'DELETE', @getHandler(@sessions[sessionId], 'DELETE')


    # on disconnect
    socket.on 'disconnect', =>
      if socket.session and socket.session.sessionId
        id = socket.session.sessionId
        # maybe connection comes back? if not: clear session after Timeout
        socket.session.timeout = setTimeout((-> Connector.clearSession(id)), @clearingTimeout*1000)

        Logger.log "Session '#{id}' disconnected"
      else
        Logger.log "disconnected"


  getHandler: (session, type) ->
    return (path, body, id) ->
      new Request(
        id: id
        type: type
        path: path
        body: body
        session: session
        sendSuccess: (body) ->
           session.socket.emit "#{type}.OK", path, body, id
        sendError: (body) ->
           session.socket.emit "#{type}.ERROR", path, body, id
        sendUpdate: (body) ->
           session.socket.emit "UPDATE", path, body, id

      ).process()
      #
      # Router.route
      #   id: id
      #   type: type
      #   path: path
      #   body: body
      #   session: session
      #   fulfill: (res) ->
      #     session.socket.emit type+'.OK', path, res, id
      #   reject: (code, payload) ->
      #     res = [code]
      #     res.push payload if payload
      #     session.socket.emit type+'.ERROR', path, res, id

  # delete old sessions after Timeout
  clearSession: (id) ->
    Logger.log  "timeout for session '#{id}'"
    Router.subRemoveSession(@sessions[id])
    delete @sessions[id]
