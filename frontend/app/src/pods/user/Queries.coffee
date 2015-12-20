liquidFlux = require 'liquidFlux'
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
