Store = require './Store'
ShiftStore = require '../shift/Store'


module.exports =
  # GET /groups
  groupList: (params,callback) ->
    Store.getGroups(params.scheduleId).then (res) ->
      response = []
      response.push(id:group.id,name:group.name) for group in res
      callback(response)


  # GET /user/:userId/event/:eventId
  userWithEventExtended: (params,callback) ->
    Store.getUserWithEvent(params.userId, params.eventId).then (res) ->
      ShiftStore.getShiftPartners(res.Shifts, res.id).then (partners) ->
        response =
          id: res.id
          name: res.name
          firstname: res.firstname
          surname: res.surname
          birthday: res.birthday
          contact:
            email: res.email
            mobile: res.mobile
          recieveSMS: res.recieveSMS
          hasPhoto: !!res.photo
          groups: {}
          event:
            id: params.eventId
            shifts: []
            MainPosition: null
            FavoritePartner: []
            from: res.UserEventSettings[0].from
            until: res.UserEventSettings[0].until

        # TODO: add Referer
        if res.UserEventSettings[0].MainPosition
          response.event.MainPosition =
            id: res.UserEventSettings[0].MainPosition.id
            name: res.UserEventSettings[0].MainPosition.title

        for group in res.Groups
          response.groups.push
            id: group.id
            name: group.name

        for shift in res.Shifts
          response.event.shifts.push
            id: shift.id
            scheduleId: shift.ScheduleId
            schedule: shift.Schedule.title
            start: shift.start
            end: shift.end
            comment: shift.comment
            opened: shift.opened
            partners: partners[shift.id]
        callback(response)


  # GET /user/:userId/photo
  userPhoto: (params,callback) ->
    Store.getUser(params.userId).then(response) ->
      # TODO: send base64 encoded photo
      callback()

  # GET /users/names
  userNames: (params,callback) ->
    Store.getUsers().then (res) ->
      response = {}
      response[user.id] = {nick:user.name,first:user.firstname,sur:user.surname} for user in res
      callback(response)

  # GET /register/mailcheck/:mail
  mailInUse: (params,callback) ->
    Store.getUserByMail(params.mail).then (res) ->
      callback({mail:params.mail,inUse:!!res})

  # GET /register/numbercheck/:number
  numberInUse: (params,callback) ->
    number = params.number
    number = '00'+number.substr(1) if number[0] == '+'
    number = '0049'+number.substr(1) if number[0] == '0' && number[1] != '0'

    Store.getUserByPhone(number).then (res) ->
      callback({number:params.number,inUse:!!res})
