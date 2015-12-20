liquidFlux = require '../../liquidFlux'
constants = require './constants'
moment = require 'moment'


module.exports = liquidFlux.createActions

  create: (req) ->
    payload =
      EventId: req.body.eventId
      title: req.body.title
      start: moment(req.body.start).format()
      end: moment(req.body.end).format()
      rating: req.body.rating
      description: req.body.description


    @dispatch(constants.CREATE, payload)
    .then req.success
    .catch req.error

  update: (req) ->
    payload =
      id: req.body.id
      values: {}

    payload.values.title = req.body.title if req.body.title
    payload.values.start =  moment(req.body.start).format() if req.body.start
    payload.values.end =  moment(req.body.end).format() if req.body.end
    payload.values.rating = req.body.rating if req.body.rating
    payload.values.description = req.body.description if req.body.description

    @dispatch(constants.UPDATE, payload)
    .then req.success
    .catch req.error
