liquidFlux = require 'liquidFlux/backend'
constants = require './constants'
helpers = require './helpers'


module.exports = liquidFlux.createActions

  sendVerifySMS: (req) ->
    code = helpers.generateCode('register.'+req.params.number)
    payload =
      to: req.params.number
      message: "#{code} ist der Code um deine Nummer für das AgratAmAgatha Helfersystem zu bestätigen"

    # TODO: handle constants.SMS_SEND
    @dispatch(constants.SMS_SEND, payload)
    .then(req.success).catch(req.error)
