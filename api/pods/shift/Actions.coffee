liquidFlux = require '../../liquidFlux'
constants = require './constants'
moment = require 'moment'


module.exports = liquidFlux.createActions

  add: (req) ->
    payload =
      ScheduleId: req.body.scheduleId
      start: moment(req.body.start).format()
      end: moment(req.body.end).format()

    @dispatch(constants.ADD, payload)
    req.success()

  update: (req) ->
    payload =
      id: req.params.shiftId

    payload.start = moment(req.body.start).format() if req.body.start
    payload.end = moment(req.body.end).format() if req.body.end

    @dispatch(constants.UPDATE, payload)
    req.success()

  delete: (req) ->
    @dispatch(constants.DELETE, parseInt(req.params.shiftId))
    req.success()
