contentGenerator = require './content'
Actions = require './Actions'
liquidFlux = require 'liquidFlux/backend'

module.exports = [
    new liquidFlux.Route
      type: 'POST'
      route: '/register/smsverify/:number'
      middleware: [
        # TODO: check if number is valid
        # TODO: check for spammer
      ]
      action: Actions.sendVerifySMS

    new liquidFlux.Route
      type: 'GET'
      route: '/register/smsverify/:number/:code'
      middleware: [
        # TODO: check for bruteforce
      ]
      content: contentGenerator.registerSMSVerification
]
