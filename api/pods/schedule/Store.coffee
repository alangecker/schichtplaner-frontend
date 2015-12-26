liquidFlux = require 'liquidFlux/backend'
models = require '../../models'
constants = require './constants'


module.exports = liquidFlux.createStore
  pod: 'schedule'
  initialise: ->
    # @bindAction constants.LIST_RECIEVE, @updateList
    # @bindAction constants.LIST_UPDATE, @updateList
    @bindAction constants.CREATE, @doCreate
    @bindAction constants.UPDATE, @doUpdate

  getInitialState: ->
    schedules: undefined
    events: undefined

  get:
    list: ->
      models.Event.findAll(
        #  order:'start ASC',
          include:{model: models.Schedule}
      ).catch(models.error)
      # models.Schedule.findAll(
      #   order:'id ASC',
      #   include:{model: models.Event})
      # .catch(models.error)

  do:
    create: (payload) ->
      models.Schedule.create(payload).then (el) =>
        @emitChange()
        return {
          id: el.id
          eventId: el.EventId
          event: '2016' #TODO: read eventname from db
        }
      .catch(models.error)

    update: (payload) ->
      models.Schedule.update(payload.values, where:{id:payload.id}).then (el) =>
        @emitChange()
      .catch(models.error)
