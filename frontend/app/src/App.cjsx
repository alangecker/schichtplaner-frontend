React = require 'react'
ScheduleActions = require 'pods/schedule/Actions'
Toolbar = require 'pods/Toolbar/components/Toolbar'

module.exports = React.createClass
  displayName: 'App'

  render: ->
    event = @props.params.event
    scheduleId = parseInt @props.params.scheduleId
    <div id="app">
      <Toolbar event={event} scheduleId={scheduleId} />
      <div id="content">{@props.children}</div>
    </div>
