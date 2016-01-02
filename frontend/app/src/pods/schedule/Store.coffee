liquidFlux = require 'liquidFlux/frontend'
Queries = require './Queries'
constants = require './constants'

module.exports = document.sstore = liquidFlux.createStore
  pod: 'Schedule'
  initialise: ->
    @bindAction constants.LIST_RECIEVE, @updateList
    @bindAction constants.LIST_UPDATE, @updateList
    @bindAction constants.CREATE, @doCreate
    @bindAction constants.UPDATE, @doUpdate

  getInitialState: ->
    schedules: undefined
    events: undefined

  get:
    schedule: (scheduleId)-> @fetch
      locally: ->
        return if not @state.schedules
        @state.schedules[scheduleId]
      remotely: ->
        Queries.getList()
      default: {}

    events: -> @fetch
      locally: ->
        return @state.events
      remotely: ->
        Queries.getList()
      default: []

    event: (event) -> @fetch
      locally: ->
        return @state.events[event] if @state.events
      remotely: ->
        Queries.getList()
      default: {}

    schedules: (event) -> @fetch
      locally: ->
        return if not @state.events or not @state.events[event]
        @state.events[event].scheduleList
      remotely: ->
        Queries.getList()
      default: {}

    eventIdByName: (name) -> @fetch
      locally: ->
        return if not @state.events or not @state.events[name]
        @state.events[name].id
      remotely: ->
        Queries.getList()
      default: 0

    activeEvent: (title) -> @fetch
      locally: ->
        return if not @state.events
        if @state.events[title] # TODO: unnecessary
          return title
        else
          lastEvent = ''
          lastEvent = title for title,o of @state.events
          return lastEvent
      remotely: ->
        Queries.getList()
      default: ''

  do:
    create: (payload) -> Queries.createSchedule(payload)
    update: (payload) -> Queries.updateSchedule(payload)

  update:
    list: (res) ->
      @state.schedules = {} if not @state.schedules
      @state.events = {}

      for event in res.events
        @state.events[event.title] = event
        @state.events[event.title].scheduleList = []
        # @state.schedules[event.title] = {}
        for schedule in event.schedules
          path = schedule.title.split('/')
          path[0] = '-' if path.length == 1
          schedule.group = path[0]
          @state.schedules[schedule.id] = schedule
          @state.events[event.title].scheduleList.push schedule

      @emitChange()
