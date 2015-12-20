liquidFlux = require 'liquidFlux'
constants = require './constants'

module.exports = liquidFlux.createActions
  create: (payload) ->
    @dispatch constants.CREATE, payload

  update: (payload) ->
    @dispatch constants.UPDATE, payload
