models = require '../../models'
moment = require 'moment'
Validator =
  stringEmpty: (s) -> (typeof s != 'string' || s.length == 0)
  dateValid: (date) -> moment(date).isValid()
  dateInFuture: (date) -> moment().isBefore(date)


module.exports =
  updateShiftValidation: (req, next, error) ->
    return error(400) unless req.body instanceof Object

    start = moment(req.body.start)
    end = moment(req.body.end)

    return error(406, 'INVALID1') if not Validator.dateValid(start)
    return error(406, 'INVALID2') if not Validator.dateValid(end)
    return error(406, 'INVALID3') if not Validator.dateInFuture(start)
    return error(406, 'INVALID4') if start.isAfter(end)

    # if req.body.AllowedGroups
    # TODO: check if allowedGroups exist

    models.Shift.findOne(
      where:{id:req.params.shiftId}
      include:{model: models.Schedule})
    .then( (el) ->
      return error(406, 'INVALID5') if not el
      return error(406, 'INVALID6') if start.isBefore(el.Schedule.start)
      return error(406, 'INVALID7') if end.isAfter(el.Schedule.end)
      next()
    ).catch(models.error)


  deleteShiftValidation: (req, next, error) ->
    models.Shift.findOne(where:{id:req.params.shiftId})
    .then( (el) ->
      return error(406, 'NOT_ALLOWED') if moment().isAfter(el.start)
      next()
    ).catch(models.error)
