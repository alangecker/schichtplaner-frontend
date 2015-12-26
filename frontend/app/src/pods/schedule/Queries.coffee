liquidFlux = require 'liquidFlux/frontend'
api = require 'api'
constants = require './constants'

module.exports = liquidFlux.createQueries
  pod: 'Schedule'
  getList:
    do: ->
      @dispatch constants.LIST_REQUEST
      api.get("/schedules", @update).then(@success, @error)
    onSuccess: (res) ->
      @dispatch constants.LIST_RECIEVE, events: res
    onUpdate: (res) ->
      @dispatch constants.LIST_UPDATE, events: res


  getSchedule:
    do: (scheduleId) ->
      api.get("/schedule/#{scheduleId}", @update).then(@success, @error)
    onSuccess: (res) ->
      @dispatch constants.RECIEVE, schedule: res
    onUpdate: (res) ->
      @dispatch constants.UPDATE, schedule: res


  createSchedule:
    do: (payload) ->
      api.post("/schedules", payload).then(@success, @error)
    onSuccess: (res) ->
      @dispatch constants.ROUTE, "/#{res[0].event}/#{res[0].id}/edit"

  updateSchedule:
    do: (payload) ->
      api.post("/schedule/#{payload.id}", payload).then(@success, @error)


  addShift:
    do: (payload) ->
      api.post("/schedule/#{payload.id}/shifts", payload).then(@success, @error)
