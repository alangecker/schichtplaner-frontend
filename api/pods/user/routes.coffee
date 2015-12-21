contentGenerator = require './content'
UserStore = require './Store'
Actions = require './Actions'
UserMiddleware = require './middleware'
liquidFlux = require 'liquidFlux/backend'

module.exports = [
    new liquidFlux.Route
      type: 'GET'
      route: '/groups'
      middleware: [
        # TODO: only moderator?
      ]
      listener: [
          [UserStore, 'CHANGE_GROUPS']
      ]
      content: contentGenerator.groupList
      cacheable: true

]
