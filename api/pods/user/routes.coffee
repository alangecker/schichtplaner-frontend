contentGenerator = require './content'
UserStore = require './Store'
Actions = require './Actions'
UserMiddleware = require './middleware'
liquidFlux = require 'liquidFlux/backend'

module.exports = [
    new liquidFlux.Route
      type: 'GET'
      route: '/groups'
      listener: [
          [UserStore, 'CHANGE_GROUPS']
      ]
      content: contentGenerator.groupList
      cacheable: true

    new liquidFlux.Route
      type: 'GET'
      route: '/user/:userId/event/:eventId/extended'
      middleware: [
        # TODO: only moderator OR requested user is loggedin
      ]
      listener: [
          [UserStore, 'CHANGE'] # TODO: nur wenn genau der Benutzer geändert wurde
      ]
      content: contentGenerator.userWithEventExtended

    new liquidFlux.Route
      type: 'GET'
      route: '/user/:userId/event/:eventId'
      listener: [
          [UserStore, 'CHANGE'] # TODO: nur wenn genau der Benutzer geändert wurde
      ]
      content: contentGenerator.userWithEvent
      cacheable: true

    new liquidFlux.Route
      type: 'GET'
      route: '/user/:userId/photo'
      listener: [
          [UserStore, 'CHANGE_PHOTO'] # TODO: nur wenn genau der Benutzer geändert wurde
      ]
      content: contentGenerator.userPhoto
      cacheable: true

    new liquidFlux.Route
      type: 'GET'
      route: '/users/names'
      listener: [
          [UserStore, 'CHANGE_NAME'] # TODO: nur wenn genau der Benutzer geändert wurde
      ]
      content: contentGenerator.userNames
      cacheable: true


    new liquidFlux.Route
      type: 'GET'
      route: '/register/mailcheck/:mail'
      listener: [
          [UserStore, 'MAILINUSE'] # TODO: nur wenn genau die Mail geändert wurde
      ]
      content: contentGenerator.mailInUse
      cacheable: true
    new liquidFlux.Route
      type: 'GET'
      route: '/register/numbercheck/:number'
      listener: [
          [UserStore, 'NUMBERINUSE'] # TODO: nur wenn genau die Nummer geändert wurde
      ]
      content: contentGenerator.numberInUse
      cacheable: true
]
