Store = require './Store'


module.exports =
  scheduleShiftList: (params,callback) ->
    console.log params
    Store.getFullShiftsBySchedule(params.scheduleId).then (response) ->
      list = []

      for shift in response
        groups = {}
        for group in shift.AllowedGroups
          groups[group.id] = group.name

        list.push {
          id: shift.id
          scheduleId: shift.ScheduleId
          start: shift.start
          end: shift.end
          UserId: shift.UserId
          User: if shift.User then shift.User.name else null
          AllowedGroups: groups
        }
      callback(list)
