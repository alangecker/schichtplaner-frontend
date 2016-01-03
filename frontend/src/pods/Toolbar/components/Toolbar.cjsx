React = require 'react'
ScheduleSelect = require './ScheduleSelect'
Logo = require './Logo'
require '../styles'


module.exports = React.createClass
  displayName: 'Toolbar'
  render: ->
    <div id="toolbar">
      <div className="left">
        <Logo />
        <ScheduleSelect event={@props.event} scheduleId={@props.scheduleId} />
      </div>
      <div className="right">
        right
      </div>
    </div>
