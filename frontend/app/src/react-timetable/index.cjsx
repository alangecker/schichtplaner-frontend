React = require 'react'
HourGrid = require './HourGrid'
ClockLine = require './ClockLine'
Events = require './Events'
moment = require 'moment'




module.exports = React.createClass

  displayName: 'Timetable'

  render: ->
    start = moment(@props.start)
    end = moment(@props.end)

    hourHeight = 24
    <div className="timetable row">
      <HourGrid
        start={start}
        end={end}
        hourHeight={hourHeight}
        onHourClick={@props.onHourClick} />
      <ClockLine start={start} end={end} hourHeight={hourHeight} />
      <Events
        start={start}
        end={end}
        hourHeight={hourHeight}>
          {@props.children}
      </Events>
    </div>
