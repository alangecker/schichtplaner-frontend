Store = require './Store'


module.exports =
  scheduleShiftList: (params,callback) ->
    Store.getFullShiftsBySchedule(params.scheduleId).then (response) ->
      list = []

      for shift in response
        groups = []
        groups.push group.id for group in shift.AllowedGroups
          # groups[group.id] = group.name
        list.push {
          id: shift.id
          scheduleId: shift.ScheduleId
          start: shift.start
          end: shift.end
          UserId: shift.UserId
          user: if shift.User then shift.User.name else null
          AllowedGroups: groups
          comment: shift.comment
          opened: shift.opened
        }
      callback(list)
