helpers = require './helpers'

module.exports =

  # GET /register/smsverify/:number/:code
  registerSMSVerification: (params,callback) ->
    correctCode = helpers.generateCode('register.'+params.number)
    correctCode = '12345'
    callback(
      number:params.number
      code:params.code
      correct: (params.code == correctCode)
    )
