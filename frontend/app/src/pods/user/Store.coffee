liquidFlux = require 'liquidFlux/frontend'
Queries = require './Queries'
constants = require './constants'

module.exports = document.sstore = liquidFlux.createStore
  pod: 'User'
  initialise: ->
    @bindAction constants.GROUPS_RECIEVE, @updateGroups
    @bindAction constants.GROUPS_UPDATE, @updateGroups


  getInitialState: ->
    groups: undefined

  get:
    groups: -> @fetch
      locally: ->
        @state.groups
      remotely: ->
        Queries.getGroups()
      default: {}

  update:
    groups: (groups) ->
      console.log groups, 'test'
      @state.groups = {}
      for group in groups
        @state.groups[group.id] = group.name
      @emitChange('CHANGE_GROUPS')
