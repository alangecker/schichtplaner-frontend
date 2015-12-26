Store = require './Store'


module.exports =
  groupList: (params,callback) ->

    Store.getGroups(params.scheduleId).then (res) ->
      response = []
      response.push(id:group.id,name:group.name) for group in res
      callback(response)


  userWithEventExtended: (params,callback) ->
    Store.getUserWithEvent(params.userId, params.eventId).then (res) ->
      console.log res, params
      response =
        name: res.name
        firstname: res.firstname
        surname: res.surname
        birthday: res.birthday
        contacts:
          email: res.email
          mobile: res.mobile
        recieveSMS: res.recieveSMS
        hasPhoto: !!res.photo
        groups: {}
        event:
          shifts: []
          MainPosition: {}
          FavoritePartner: []

      if res.MainPosition
        response.event.MainPosition =
          id: res.MainPosition.id
          name: res.MainPosition.title

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


      # TODO: add Referer

      callback(response)

  userPhoto: (params,callback) ->
    Store.getUser(params.userId).then(response) ->
      # TODO: send base64 encoded photo
      callback()
