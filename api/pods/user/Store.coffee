liquidFlux = require 'liquidFlux/backend'
models = require '../../models'
constants = require './constants'

module.exports = liquidFlux.createStore
  pod: 'User'
  initialise: ->
    # @bindAction constants.ADD, @doAddShift
    # @bindAction constants.UPDATE, @doUpdateShift
    # @bindAction constants.DELETE, @doDeleteShift
    #

  get:
    groups:  ->
      models.Group.findAll().catch(models.error)

    userWithEvent: (userId, eventId) ->

      models.User.findOne({
        where:
          id: userId
        include: [
          models.Group
          {
            model: models.Shift
            include: [
              {
                model: models.Schedule
                where: {EventId:eventId}
              }
            ]
          },
          {
            model: models.UserEventSettings
            where: {EventId:eventId}
            include: [
              {
                model: models.Schedule
                as: 'MainPosition'
              },
              {
                model: models.User
                as: 'FavoritePartner'
              },
              # TODO: add favorite Positions/Schedules
            ]
          }
        ]
      }).catch(models.error)
