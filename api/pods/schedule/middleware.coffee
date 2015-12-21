models = require '../../models'
moment = require 'moment'
module.exports =

  createScheduleValidation: (req, next, error) ->
    console.log req, 'middleware'
    return error(400) unless req.body instanceof Object
    return error(406, 'SCHEDULE_CREATE_MISSING') unless (req.body.eventId and typeof req.body.title is 'string' and req.body.title)
    start = moment(req.body.start)
    end = moment(req.body.end)
    return error(406, 'SCHEDULE_CREATE_INVALID') if typeof req.body.eventId != 'number' || req.body.eventId < 1 || not start.isValid() || not end.isValid() || start.isAfter(end) || req.body.rating < -2 || req.body.rating > 2
    next()

  updateScheduleValidation: (req, next, error) ->
    if req.body.title != undefined
      return error(406, 'SCHEDULE_UPDATE_MISSING') unless req.body.title
      # TODO: duplicate title?

    if req.body.start != undefined
      return error(406, '') unless req.body.start
    next()
