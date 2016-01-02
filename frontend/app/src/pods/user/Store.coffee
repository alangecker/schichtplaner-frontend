liquidFlux = require 'liquidFlux/frontend'
Queries = require './Queries'
constants = require './constants'
assign = require 'object-assign'

module.exports = liquidFlux.createStore
  pod: 'User'
  initialise: ->
    @bindAction constants.GROUPS_RECIEVE, @updateGroups
    @bindAction constants.GROUPS_UPDATE, @updateGroups
    @bindAction constants.USER_RECIEVE, @updateUser
    @bindAction constants.USER_UPDATE, @updateUser
    @bindAction constants.USERNAMES_RECIEVE, @updateUserNames
    @bindAction constants.USERNAMES_UPDATE, @updateUserNames
    @bindAction constants.MAILINUSE, @updateMailInUse
    @bindAction constants.NUMBERINUSE, @updateNumberInUse
    @bindAction constants.VERIFYSMS_SEND, @doSendVerifySMS
    @bindAction constants.VERIFYSMS_CHECK, @updateVerifyCode


  getInitialState: ->
    groups: undefined
    users: {}
    userNames: undefined
    usedMails: {}
    usedNumbers: {}
    checkedCodes: {}

  get:
    groups: -> @fetch
      locally: ->
        @state.groups
      remotely: ->
        Queries.getGroups()
      default: {}

    eventUser: (id, eventId) -> @fetch
      locally: ->
        return null if not id or not eventId
        return undefined if not @state.users or not @state.users[id] or not @state.users[id].events[eventId]
        return assign({event:@state.users[id].events[eventId]}, @state.users[id])
      remotely: ->
        if true # TODO: check if mod or requested user is loggedin
          Queries.getEventUserExtended(id, eventId)
        else
          Queries.getEventUser(id, eventId)
      default: {}

    userNames: -> @fetch
      locally: ->
        @state.userNames
      remotely: -> Queries.getUserNames()
      default: {}

  is:
    mailInUse: (mail) -> @fetch
      locally: -> @state.usedMails[mail]
      remotely: -> Queries.isMailInUse(mail)
      default: undefined
    numberInUse: (number) -> @fetch
      locally: -> @state.usedNumbers[number]
      remotely: -> Queries.isNumberInUse(number)
      default: undefined
    correctCode: (number, code) -> @fetch
      locally: -> @state.checkedCodes[number][code] if @state.checkedCodes[number]
      remotely: -> Queries.checkSMSCode(number,code)
      default: undefined

  update:
    groups: (groups) ->
      @state.groups = {}
      for group in groups
        @state.groups[group.id] = group.name
      @emitChange('CHANGE_GROUPS')

    userNames: (users) ->
      @state.userNames = users
      @emitChange('USERNAMES')

    user: (user) ->
      if @state.users[user.id] && @state.users[user.id].event
        oldEvents = @state.users[user.id].event
        @state.users[user.id] = user
        @state.users[user.id].events = oldEvents
        @state.users[user.id].events[user.event.id] = user.event
      else
        @state.users[user.id] = user
        @state.users[user.id].events = {}
        @state.users[user.id].events[user.event.id] = user.event
      @emitChange 'CHANGED_USER', user

    mailInUse: (res) ->
      @state.usedMails[res.mail] = res.inUse
      @emitChange('MAILINUSE', res.mail)
    numberInUse: (res) ->
      @state.usedNumbers[res.number] = res.inUse
      @emitChange('NUMBERINUSE', res.number)
    verifyCode: (res) ->
      @state.checkedCodes[res.number] = {} if not @state.checkedCodes[res.number]
      @state.checkedCodes[res.number][res.code] = res.correct
      @emitChange('SMSVERIFY', res.number)
  do:
    sendVerifySMS: (phone) ->
      Queries.sendVerifySMS(phone)
