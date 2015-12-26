liquidFlux = require 'liquidFlux/frontend'
api = require 'api'
constants = require './constants'

module.exports = liquidFlux.createQueries
  pod: 'User'
  getGroups:
    do: ->
      api.get("/groups", @update).then(@success, @error)
    onSuccess: (res) ->
      @dispatch constants.GROUPS_RECIEVE, res
    onUpdate: (res) ->
      @dispatch constants.GROUPS_UPDATE, res

  getEventUserExtended:
    do: (id, eventId) ->
      api.get("/user/#{id}/event/#{eventId}/extended", @update).then(@success, @error)
    onSuccess: (res) ->
      @dispatch constants.USER_RECIEVE, res
    onUpdate: (res) ->
      @dispatch constants.USER_UPDATE, res
