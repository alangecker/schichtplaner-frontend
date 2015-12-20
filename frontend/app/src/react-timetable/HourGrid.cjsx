React = require 'react'
moment = require 'moment'
moment.locale('de')
HourGridLine = require './HourGridLine'

module.exports = React.createClass

  displayName: 'HourGrid'

  render: ->
    grid = []
    i = 0
    cur = moment(@props.start)
    while cur.isBefore(@props.end) or cur.isSame(@props.end)
      grid.push <HourGridLine time={moment(cur)} count={i} key={i++} hourHeight={@props.hourHeight} onHourClick={@props.onHourClick} />
      cur.add(1, 'h')

    <div className="grid">
      {grid}
    </div>




  # getHours: ->
  #   moment.locale 'de'
  #   dayLimit = 5
  #
  #
  #   response = []
  #   start = moment.unix(@props.start)
  #   end = moment.unix(@props.end)
  #   # hours = end.diff(start, 'hours')
  #   response.push
  #
  #     start.format('dddd')
  #
  #   cur = moment(start)
  #   while cur.isBefore(end)
  #     cur.add(1, 'hours')
  #     if cur.hour() is dayLimit
  #       response.push cur.format('dddd')
  #     else
  #       response.push cur.format('H')+' Uhr'
