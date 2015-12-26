liquidFlux = require 'liquidFlux/frontend'
Queries = require './Queries'
constants = require './constants'
assign = require 'object-assign'

module.exports = document.sstore = liquidFlux.createStore
  pod: 'User'
  initialise: ->
    @bindAction constants.GROUPS_RECIEVE, @updateGroups
    @bindAction constants.GROUPS_UPDATE, @updateGroups


  getInitialState: ->
    groups: undefined
    users: undefined

  get:
    groups: -> @fetch
      locally: ->
        @state.groups
      remotely: ->
        Queries.getGroups()
      default: {}

    eventUser: (id, eventId) -> @fetch
      locally: ->
        return null if not id
        return undefined if not @state.users or not @state.users[id] or not @state.users[id].event[eventId]
        return assign({event:@state.users[id].event[eventId]}, @state.users[id])
      remotely: ->
        if true # TODO: check if mod or requested user is loggedin
          Queries.getEventUserExtended(id, eventId)
        else
          Queries.getEventUser(id, eventId)
      default: {}

  update:
    groups: (groups) ->
      @state.groups = {}
      for group in groups
        @state.groups[group.id] = group.name
      @emitChange('CHANGE_GROUPS')
