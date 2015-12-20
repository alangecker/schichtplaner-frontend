liquidFlux = require '../../liquidFlux'
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
