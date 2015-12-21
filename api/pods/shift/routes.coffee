contentGenerator = require './content'
ShiftStore = require './Store'
Actions = require './Actions'
ShiftMiddleware = require './middleware'
liquidFlux = require 'liquidFlux/backend'

module.exports = [
    new liquidFlux.Route
      type: 'GET'
      route: '/schedule/:scheduleId/shifts'
      listener: [
          [ShiftStore, 'CHANGE']
      ]
      content: contentGenerator.scheduleShiftList
      cacheable: true


    new liquidFlux.Route
      type: 'POST'
      route: '/schedule/:scheduleId/shifts'
      middleware: [
        #UserMiddleware.isModerator
        # ShiftMiddleware.shiftValidation
      ]
      action: Actions.add

    new liquidFlux.Route
      type: 'POST'
      route: '/shift/:shiftId'
      middleware: [
        #UserMiddleware.isModerator
        ShiftMiddleware.updateShiftValidation
      ]
      action: Actions.update

    new liquidFlux.Route
      type: 'DELETE'
      route: '/shift/:shiftId'
      middleware: [
        ShiftMiddleware.deleteShiftValidation
        #UserMiddleware.isModerator
      ]
      action: Actions.delete


]
