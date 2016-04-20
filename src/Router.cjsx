React = require 'react'
Router = require('react-router').Router
Route = require('react-router').Route
createHistory = require('history/lib/createHashHistory')
liquidFlux = require 'liquidFlux/frontend'
App = require 'pods/app'

#
ScheduleCreate = require 'pods/schedule/components/Create'
ScheduleEdit = require 'pods/schedule/components/Edit'
ScheduleShow = require 'pods/schedule/components/Show'
Register = require 'pods/user/components/Register'
Moderator = require 'pods/moderation/components/Index'
ModeratorUser = require 'pods/moderation/components/user/List'


Welcome = Conflicts = MyShifts = Settings = ModeratorShift = ModeratorSchedule = Schedule = React.createClass
  render: -> <div>{@props.children}</div>

Calendar = APITester = Register

requireAuth = (nextState, replaceState) ->
requireModerator = (nextState, replaceState) ->


liquidFlux.Dispatcher.register 'ROUTE', (route) ->
  document.location.hash = route

module.exports =
   <Router history={createHistory(queryKey: false)}>
      <Route name="app" path="/" component={App}>
        <Route path="tester" component={APITester} />
        <Route name="register" path="register" components={Register} />
        <Route name="register" path="register/:step" components={Register} />
        <Route name="settings" path="settings" component={Settings} onEnter={requireAuth} />
        <Route name="my" path=":event/my" component={MyShifts} onEnter={requireAuth} />
        <Route name="new" path=":event/new" component={ScheduleCreate} onEnter={requireModerator} />
        <Route name="moderation" path=":event/moderation" component={Moderator} onEnter={requireModerator} >
          <Route path="user" components={ModeratorUser} />
          <Route path="shifts" components={ModeratorShift} />
          <Route path="conflicts" component={Conflicts} />
        </Route>
        <Route path=":event/:scheduleId/edit" components={ScheduleEdit} onEnter={requireModerator} />
        <Route path=":event/:scheduleId" component={ScheduleShow} />
        <Route path=":event" component={Welcome} />
      </Route>
  </Router>
