moment = require 'moment'


users = {
  1:
    id: 1
    name: 'Andi' #unnötig
    from: '2016-01-08 00:00:00+01'
    until: '2016-01-10 11:00:00+01'
    favoritePartners: [2,3,4]
}


groups: {
  1: [1,2,3,4] # Ordner
  2: [] # Backstage
  3: [] # Büro
}

shifts: [
  {
      id:1
      start: '2016-01-08 12:00:00+01'
      end: '2016-01-08 14:00:00+01'
      allowedGroups: []
  }
  {
      id:2
      start: '2016-01-08 14:00:00+01'
      end: '2016-01-08 16:00:00+01'
  }
]



# ===========================================
getGroupUsers = (groupsIds) ->
  response = []
  for groupId in groupsIds
    for userId in groups[groupsId]
      response.push(userId) if response.indexOf(userId) == -1
  return response


for id of users
  users[id].from = moment(users[id].from).unix()
  users[id].until = moment(users[id].until).unix()


for shift,i in shifts
  shifts[i].start = moment(shifts.start).unix()
  shifts[i].end = moment(shifts.end).unix()
  shifts[i].allowedUser = getGroupUsers(shift.allowedGroups)
