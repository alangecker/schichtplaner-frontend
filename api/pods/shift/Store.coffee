liquidFlux = require 'liquidFlux/backend'
models = require '../../models'
constants = require './constants'
moment = require 'moment'

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
        # TODO: order by start
      ).catch(models.error)


    shiftPartners: (shifts, excludeUser) ->
      conditions = []
      response = {}
      for shift in shifts
        conditions.push
          start: {$between: [shift.start, shift.end]}
          ScheduleId: shift.ScheduleId
        conditions.push
          end: {$between: [shift.start, shift.end]}
          ScheduleId: shift.ScheduleId
        shift.startUnix = moment(shift.start).unix()
        shift.endUnix = moment(shift.end).unix()
        response[shift.id] = []

      models.Shift.findAll({
        where:
          UserId: {$gt:0}
          #UserId: {$ne:excludeUser} # TODO: uncomment
          $or: conditions # TODO: maybe buggy
        include: [
          models.User
        ]
        # TODO: order by start
      }).then( (partnerShifts) ->

        for partnerShift in partnerShifts
          start = moment(partnerShift.start).unix()
          end = moment(partnerShift.end).unix()
          for shift in shifts
            if shift.ScheduleId == partnerShift.ScheduleId && !(start >= shift.endUnix || shift.startUnix >= end)
              # Shift is overlapping
              response[shift.id].push partnerShift.User.name if response[shift.id].indexOf(partnerShift.User.name) == -1
              break
        return response
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
