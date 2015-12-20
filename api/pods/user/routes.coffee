contentGenerator = require './content'
UserStore = require './Store'
Actions = require './Actions'
UserMiddleware = require './middleware'


module.exports = [
    {
      type: 'GET'
      route: '/groups'
      middleware: [
        # TODO: only moderator?
      ]
      listener: [
          [UserStore, 'CHANGE_GROUPS']
      ]
      content: contentGenerator.groupList
    },
]
