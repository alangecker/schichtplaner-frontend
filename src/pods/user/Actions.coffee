liquidFlux = require 'liquidFlux/frontend'
constants = require './constants'

module.exports = liquidFlux.createActions
  sendVerifySMS: (phone) ->
    @dispatch constants.VERIFYSMS_SEND, phone

  register: (data) ->
    @dispatch constants.REGISTER, data
