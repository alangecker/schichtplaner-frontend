models = require '../../models'
moment = require 'moment'
Validator =
  stringEmpty: (s) -> (typeof s != 'string' || s.length == 0)
  dateValid: (date) -> moment(date).isValid()
  dateInFuture: (date) -> moment().isBefore(date)


module.exports = {}
