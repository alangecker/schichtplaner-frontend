liquidFlux = require 'liquidFlux/frontend'
api = require 'api'
constants = require './constants'


module.exports = liquidFlux.createQueries
  pod: 'User'
  getGroups:
    do: ->
      api.get("/groups", @update).then(@success, @error)
    onSuccess: (res) ->
      @dispatch constants.GROUPS_RECIEVE, res
    onUpdate: (res) ->
      @dispatch constants.GROUPS_UPDATE, res

  getEventUserExtended:
    do: (id, eventId) ->
      api.get("/user/#{id}/event/#{eventId}/extended", @update).then(@success, @error)
    onSuccess: (res) ->
      @dispatch constants.USER_RECIEVE, res
    onUpdate: (res) ->
      @dispatch constants.USER_UPDATE, res

  getUserNames:
    do: ->
      api.get("/users/names", @update).then(@success, @error)
    onSuccess: (res) ->
      @dispatch constants.USERNAMES_RECIEVE, res
    onUpdate: (res) ->
      @dispatch constants.USERNAMES_UPDATE, res

  isMailInUse:
    do: (mail) ->
      api.get("/register/mailcheck/#{encodeURIComponent(mail)}", @update).then(@success, @error)
    onSuccess: (res) ->
      @dispatch constants.MAILINUSE, res
    onUpdate: (res) ->
      @dispatch constants.MAILINUSE, res

  isNumberInUse:
    do: (number) ->
      api.get("/register/numbercheck/#{encodeURIComponent(number)}", @update).then(@success, @error)
    onSuccess: (res) ->
      @dispatch constants.NUMBERINUSE, res
    onUpdate: (res) ->
      @dispatch constants.NUMBERINUSE, res

  sendVerifySMS:
    do: (phone) ->
      api.post("/register/smsverify/#{encodeURIComponent(phone)}").then(@success, @error)

  checkSMSCode:
    do: (number,code) ->
      api.get("/register/smsverify/#{encodeURIComponent(number)}/#{code}").then(@success, @error)
    onSuccess: (res) ->
      @dispatch constants.VERIFYSMS_CHECK, res

  register:
    do: (payload) ->
      api.post("/register", payload).then(@success, @error)
    onSuccess: (res) ->
      @dispatch constants.LOGIN_SUCCESS, res
      @dispatch constants.ROUTE, "/"
