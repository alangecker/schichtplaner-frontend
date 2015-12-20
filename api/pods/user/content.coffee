Store = require './Store'


module.exports =
  groupList: (params,callback) ->

    Store.getGroups(params.scheduleId).then (res) ->
      response = []
      response.push(id:group.id,name:group.name) for group in res
      callback(response)
