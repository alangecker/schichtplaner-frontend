contentGenerator = require './content'
ShiftStore = require './Store'
Actions = require './Actions'
ShiftMiddleware = require './middleware'


module.exports = [
    {
      type: 'GET'
      route: '/schedule/:scheduleId/shifts'
      listener: [
          [ShiftStore, 'CHANGE']
      ]
      content: contentGenerator.scheduleShiftList
    },
    {
      type: 'POST'
      route: '/schedule/:scheduleId/shifts'
      middleware: [
        #UserMiddleware.isModerator
        # ShiftMiddleware.shiftValidation
      ]
      action: Actions.add
    },
    {
      type: 'POST'
      route: '/shift/:shiftId'
      middleware: [
        #UserMiddleware.isModerator
        ShiftMiddleware.updateShiftValidation
      ]
      action: Actions.update
    },
    {
      type: 'DELETE'
      route: '/shift/:shiftId'
      middleware: [
        ShiftMiddleware.deleteShiftValidation
        #UserMiddleware.isModerator
      ]
      action: Actions.delete
    },

]
