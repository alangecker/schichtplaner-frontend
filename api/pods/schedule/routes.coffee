contentGenerator = require './content'
ScheduleStore = require './Store'
Actions = require './Actions'
ScheduleMiddleware = require './middleware'


module.exports = [

    {
      type: 'GET'
      route: '/schedules'
      listener: [
          [ScheduleStore, 'CHANGE']
      ]
      content: contentGenerator.list
    },

    {
      # create new schedule
      type: 'POST'
      route: '/schedules'
      middleware:[
        #UserMiddleware.isModerator
        ScheduleMiddleware.createScheduleValidation
      ]
      action: Actions.create
    },

    {
      # update schedule-infos
      type: 'POST'
      route: '/schedule/:scheduleId'
      middleware:[
        # UserMiddleware.isModerator
        ScheduleMiddleware.updateScheduleValidation
      ]
      action: Actions.update
    },

    
    #
    #
    # {
    #   # create new schedule
    #   type: 'POST'
    #   route: '/schedules'
    #   middleware:[
    #     UserMiddleware.isModerator
    #     ScheduleMiddleware.createScheduleValidation
    #   ]
    #   action: ScheduleActions.create
    # },
    #
    # {
    #   # update schedule-infos
    #   type: 'POST'
    #   route: '/schedule/:scheduleId'
    #   middleware:[
    #     UserMiddleware.isModerator
    #     ScheduleMiddleware.updateScheduleValidation
    #   ]
    #   action: ScheduleActions.update
    # },

]
