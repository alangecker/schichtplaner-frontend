liquidFlux = require 'liquidFlux'
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
        return if not @state.events
        res = []
        res.push(e) for event,e of @state.events
        return res
      remotely: ->
        Queries.getList()
      default: {}

    schedulesByGroups: (event) -> @fetch
      locally: ->
        return if not @state.events or not @state.events[event]
        @state.events[event].groups
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

  do:
    create: (payload) -> Queries.createSchedule(payload)
    update: (payload) -> Queries.updateSchedule(payload)

  update:
    list: (res) ->
      @state.schedules = {} if not @state.schedules
      @state.events = {}

      for schedule in res.schedules
        path = schedule.title.split('/')
        path[0] = '-' if path.length == 1

        @state.schedules[schedule.id] = schedule

        if not @state.events[schedule.event]
          @state.events[schedule.event] =
            title: schedule.event
            id: schedule.eventId
            groups: {}

        if not @state.events[schedule.event].groups[path[0]]
          @state.events[schedule.event].groups[path[0]] = []

        @state.events[schedule.event].groups[path[0]].push @state.schedules[schedule.id]
      @emitChange()
