React = require 'react'
Router = require('react-router').Router
Route = require('react-router').Route
liquidFlux = require 'liquidFlux/frontend'
history = require './history'
App = require './App'




ScheduleCreate = require 'pods/schedule/components/Create'
ScheduleEdit = require 'pods/schedule/components/Edit'


# Calendar = require './components/Calendar'
#
# ScheduleEdit = require './components/Schedule/Edit'

#
# APITester = require './components/_APITester'



Register = Welcome = Conflicts = MyShifts = Settings = Moderator = ModeratorUser = ModeratorShift = ModeratorSchedule = Schedule = React.createClass
  render: -> <div>{@props.children}</div>

Calendar = APITester = Register

requireAuth = (nextState, replaceState) ->
requireModerator = (nextState, replaceState) ->


liquidFlux.Dispatcher.register 'lF.ROUTE', (route) ->
  document.location.hash = route

module.exports =
   <Router history={history}>
      <Route name="app" path="/" component={App}>
        <Route path="tester" component={APITester} />
        <Route name="register" path="register" components={Register} />
        <Route name="settings" path="settings" component={Settings} onEnter={requireAuth} />
        <Route name="my" path=":event/my" component={MyShifts} onEnter={requireAuth} />
        <Route name="new" path=":event/new" component={ScheduleCreate} onEnter={requireModerator} />
        <Route name="moderator" path=":event/moderator" component={Moderator} onEnter={requireModerator} >
          <Route path="user" components={ModeratorUser} />
          <Route path="shifts" components={ModeratorShift} />
          <Route path="conflicts" component={Conflicts} />
        </Route>
        <Route path=":event/:scheduleId/edit" components={ScheduleEdit} onEnter={requireModerator} />
        <Route path=":event/:scheduleId" component={Calendar} />
        <Route path=":event" component={Welcome} />
      </Route>
  </Router>
