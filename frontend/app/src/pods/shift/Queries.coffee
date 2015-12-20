liquidFlux = require 'liquidFlux'
api = require 'api'
constants = require './constants'

module.exports = liquidFlux.createQueries
  pod: 'Shift'
  getShiftsByScheduleId:
    do: (scheduleId) ->
      api.get("/schedule/#{scheduleId}/shifts", @update).then(@success, @error)
    onSuccess: (res) ->
      @dispatch constants.SCHEDULESHIFTS_RECIEVE, shifts: res
    onUpdate: (res) ->
      @dispatch constants.SCHEDULESHIFTS_UPDATE, shifts: res


  addShift:
    do: (payload) ->
      api.post("/schedule/#{payload.scheduleId}/shifts", payload).then(@success, @error)

  updateShift:
    do: (payload) ->
      api.post("/shift/#{payload.id}", payload).then(@success, @error)

  deleteShift:
    do: (shiftId) ->
      api.delete("/shift/#{shiftId}", shiftId).then(@success, @error)
