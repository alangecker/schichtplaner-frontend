liquidFlux = require 'liquidFlux/frontend'
Queries = require './Queries'
constants = require './constants'

module.exports = document.sstore = liquidFlux.createStore
  pod: 'Shift'
  initialise: ->
    @bindAction constants.ADD, @doAddShift
    @bindAction constants.UPDATE, @doUpdateShift
    @bindAction constants.DELETE, @doDeleteShift
    @bindAction constants.SCHEDULESHIFTS_RECIEVE, @updateScheduleShifts
    @bindAction constants.SCHEDULESHIFTS_UPDATE, @updateScheduleShifts

  getInitialState: ->
    shifts: {}
    shiftsByScheduleId: {}

  get:
    shiftsByScheduleId: (scheduleId) -> @fetch
      locally: ->
        return [] if not scheduleId
        return if not @state.shiftsByScheduleId
        return @state.shiftsByScheduleId[scheduleId]
      remotely: ->
        Queries.getShiftsByScheduleId(scheduleId)
      default: []

  do:
    addShift: (payload) ->
      Queries.addShift(payload)

    updateShift: (payload) ->
      Queries.updateShift(payload)

    deleteShift: (payload) ->
      Queries.deleteShift(payload)

  update:
    scheduleShifts: (res) ->
      return if not res.shifts.length
      @state.shiftsByScheduleId[res.shifts[0].scheduleId] = []
      for shift in res.shifts
        @state.shifts[shift.id] = shift
        @state.shiftsByScheduleId[shift.scheduleId].push @state.shifts[shift.id]
      @emitChange()
