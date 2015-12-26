liquidFlux = require 'liquidFlux/backend'
models = require '../../models'
constants = require './constants'

module.exports = liquidFlux.createStore
  pod: 'shift'
  initialise: ->
    @bindAction constants.ADD, @doAddShift
    @bindAction constants.UPDATE, @doUpdateShift
    @bindAction constants.DELETE, @doDeleteShift


  getInitialState: ->
    schedules: undefined
    events: undefined


  get:
    fullShiftsBySchedule: (scheduleId) ->
      models.Shift.findAll(
        where:
          ScheduleId:scheduleId
        include:[
          {model: models.User}
          {model: models.Group, as: 'AllowedGroups'}
        ]
      ).catch(models.error)



  do:
    addShift: (payload) ->
      models.Shift.create(payload).then (el) =>
        @emitChange()
      .catch(models.error)

    updateShift: (payload) ->
      models.Shift.findOne(
        where:
          id:payload.id
        include:[
          {model: models.User}
          {model: models.Group, as: 'AllowedGroups'}
        ]
      ).then( (shift) =>

        shift.set(payload)
        shift.setAllowedGroups(payload.groups) if payload.groups

        return shift.save()
      ).then(=>
        setTimeout( (=>@emitChange()), 10) # workaround, TODO: find out why Row issnt updated after promise gots resolved  
      ).catch(models.error)


    deleteShift: (shiftId) ->
      models.Shift.destroy(
        where:
          id:shiftId
      ).then( (el) =>
        @emitChange()
      ).catch(models.error)

      # models.Shift.create(payload).then (el) =>
      #   @emitChange()
      # .catch(models.error)
