Dispatcher  = require './Dispatcher'
mixin = require './mixin'
API = require './API'
createStore = require './createStore'
createQueries = require './createQueries'
createActions = require './createActions'


liquidFlux =
  Dispatcher: Dispatcher
  mixin: mixin
  API: API

  createActions: createActions
  createQueries: createQueries
  createStore: createStore
  constants: (prefix, keys) ->
    response = {
      ROUTE: 'lF.ROUTE'
    }
    response[k] = prefix+'.'+k for k in keys
    return response

module.exports = liquidFlux
