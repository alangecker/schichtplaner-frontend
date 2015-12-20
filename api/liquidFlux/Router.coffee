i40router = require 'i40'
Logger = require('./Logger')('Router')

module.exports = Router =

  # Routerscripts
  i40:
    GET: new i40router()
    POST: new i40router()
    DELETE: new i40router()


  _routes:
    GET: []
    POST: []
    DELETE: []

  route: (type, path) ->
    i40res = @i40[type].match(path)

    return false if not i40res
    route = null
    for r in @_routes[type]
      if r.route == i40res.route
        route = r
        break
    if not route
      Logger.error "route #{type} #{i40res.route} is invalid"
      return false
    else
      return {
        params: i40res.params
        path: i40res.route
        route: route
      }


  generateStoreEventHandler: (req, params, condition) ->
    # return an Callback
    return (event) ->
      if not condition or condition(event, params)
        req.route.content params, (response) ->
          Logger.log "send UPDATE to #{req.path}"
          Router.pub(req.path, response)




  # PUB/SUB
  _subs: {}
  _sockets: {}
  sub: (key, session) ->
    Logger.log "#{session.sessionId} subscribe to #{key}"
    if @_subs[key]
      @_subs[key].push session.sessionId if @_subs[key].indexOf(session.sessionId) == -1
    else
      @_subs[key] = [session.sessionId]
    @_sockets[session.sessionId] = session.socket

  pub: (key, value) ->
    console.log 'PUB '+key, @_subs[key]
    return unless @_subs[key]
    for sessionId in @_subs[key]
      @_sockets[sessionId].emit 'UPDATE', key, value

  subRemoveSession: (session) ->
    for key,sessions of @_subs
      for s,i in sessions
        if s.sessionId is session.sessionId

          if sessions.length == 1
            delete @_subs[key]
          else
            @_subs[key].splice(i)
          break



  add: (routes) ->
    for route in routes
      route.subSockets = []
      route.listenerSetted = false
      @_routes[route.type].push route
      @i40[route.type].addRoute route.route, ->


  #
  #
  # # helpers
  # # ================================
  # _getRoute: (type, route) ->
  #
  #   return null
  #
  #
  # # route the request
  # route2: (req) ->
  #   # match req.path
  #   match = @i40[req.type].match(req.path)
  #
  #   # nothing found? 404 & exit!
  #   return req.reject(404) if not match
  #
  #   #
  #   req.route = match.route
  #   req.params = match.params
  #   route = @_getRoute(req.type, match.route)
  #
  #   # process Middleware - i.e. enough rights?
  #   @processMiddleware(route.middleware, req)
  #   .then((=> # onSuccess
  #
  #     # something to subscribe?
  #     if route.listener and route.listener.length and route.parseOutput
  #       @sub(req.path, req.session)
  #
  #     # in cache?
  #     # TODO
  #
  #     # Store-Listener active?
  #     if not route.listenerSetted and route.listener and route.listener.length
  #       for listener in route.listener
  #         listener[0].on( listener[1], @genClientEventHandler(route, req.params, listener[2]))
  #       route.listenerSetted = true
  #
  #     console.log route
  #     # call action if set
  #     route.action(req)  if route.action
  #
  #     # response
  #     if route.parseOutput
  #       route.parseOutput req.params, (response) ->
  #         # TODO: save in cache
  #         req.fulfill(response)
  #   ),(err) -> # onError
  #     console.log 'Error:', err
  #     req.reject(err[0], err[1])
  #   )
  #
  # # go through every middleware
  # processMiddleware: (middleware, req) -> new Promise (fulfill, reject) ->
  #     i = 0
  #     error = (code, msg) -> reject([code, msg])
  #     next = ->
  #       if i < middleware.length
  #         cb = middleware[i++]
  #         console.error "Error: #{req.type} #{req.path} - middleware[#{i-1}] ist not an callback" if typeof cb != 'function'
  #         cb(req, next, error)
  #       else
  #         fulfill()
  #     next()
  #
  #
  #
  #
  #
  #
  # _generatePath: (route, params) ->
  #   for key,value of params
  #     route = route.replace(':'+key, value)
  #   return route
