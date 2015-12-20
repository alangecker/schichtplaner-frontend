Store = require './Store'


module.exports =
  list: (params,callback) ->
    Store.getList().then (response) ->

      list = for schedule in response
                id: schedule.id
                eventId: schedule.EventId
                event: schedule.Event.title
                title: schedule.title
                start: schedule.start
                end: schedule.end
                rating: schedule.rating
                description: schedule.description
      callback(list)
