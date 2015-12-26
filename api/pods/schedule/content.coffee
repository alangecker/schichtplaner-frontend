Store = require './Store'


module.exports =
  list: (params,callback) ->
    Store.getList().then (events) ->
      res = []
      for event in events
        el =
          id: event.id
          title: event.title
          start: event.start
          end: event.end
          schedules: []
        for schedule in event.Schedules
          el.schedules.push
            id: schedule.id
            eventId: event.id
            title: schedule.title
            start: schedule.start
            end: schedule.end
            description: schedule.description
            rating: schedule.rating
        res.push el
      callback res
