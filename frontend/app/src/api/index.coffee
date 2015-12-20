config = require('config')

liquidFlux = require 'liquidFlux'


module.exports =
  auth: null
  server: null
  connect: ->
    @server = new liquidFlux.API(config.api)

  get: (path, onChange) -> @server.get(path, onChange)
  post: (path, args) -> @server.post(path, args)
  delete: (path, args) -> @server.delete(path, args)

  _getDevInfos: ->
    sessionId: @server.sessionId
    packetIds: @server._packetIds
    header: @server.header


setInterval (->
  console.info 'sessionId: '+module.exports.server.sessionId
), 10000
