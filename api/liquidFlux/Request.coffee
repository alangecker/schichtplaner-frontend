
Router = require './Router'
Logger = require('./Logger')('Request')



class Request
  req: {}


  constructor: (details) ->
    @[key] = value for key,value of details

  success: (body) =>
    Logger.log "OK @ #{@type} #{@path}"
    @sendSuccess(body)


  error: (code, message, payload) =>
    body =
      code: code
      message: message
    body.payload = payload if payload
    @sendError(body)
    Logger.log "ERROR #{code} @ #{@type} #{@path}"+(if message then  "=> #{message}" else '')



  process: ->
    Logger.log "#{@type} #{@path}"
    # find route
    match = Router.route(@type, @path)

    @route = match.route
    @params = match.params
    return @error(404) if not match
    @processMiddleware()

  processMiddleware: ->
    i = 0
    if not @route.middleware
      @processListener()
      return

    error = (code, msg, payload) => @error(code, msg, payload)
    next = =>
      if i < @route.middleware.length
        cb = @route.middleware[i++]
        if typeof cb != 'function'
          Logger.error "Error: #{@type} #{@path} - middleware[#{i-1}] ist not an callback"
        else
          cb(@, next, error)
      else
        @processListener()
    next()

  processListener: ->

    # something to subscribe?
    if not @route.listener || not @route.listener.length || typeof @route.content != 'function'
      @processAction()

    else
      # subscribe this Route to current Session
      Router.sub(@path, @session)

      # Store-Listener already activated? if not:
      if not @route.listenerSetted
        for listener in @route.listener

          listener[0].addListener( listener[1], Router.generateStoreEventHandler(@, @params, listener[2]))
        @route.listenerSetted = true

      @processAction()

  processAction: ->
    @route.action(@) if @route.action
    @processContent()

  processContent: ->
    if @route.content
      @route.content @params, @success.bind(@)



module.exports = Request
