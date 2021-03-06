liquidFlux = require 'liquidFlux/frontend'
constants = require './constants'

module.exports = liquidFlux.createActions

  add: (scheduleId, start, end) ->
    payload =
      scheduleId: scheduleId
      start: start
      end: end
    @dispatch constants.ADD, payload

  updateTimes: (shiftId, start, end) ->
    payload =
      id: shiftId
      start: start
      end: end
    @dispatch constants.UPDATE, payload

  updateGroups: (shiftId, groups) ->
    payload =
      id: shiftId
      groups: groups
    @dispatch constants.UPDATE, payload


  delete: (shiftId) ->
    @dispatch constants.DELETE, shiftId
