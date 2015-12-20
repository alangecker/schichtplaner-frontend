React = require 'react'
moment = require 'moment'


module.exports = React.createClass
  displayName: 'Shift'


  render: ->
    className = "event"
    className += ' '+@props.className if @props.className
    <div className={className} ref="event">
      <div className="time">
        {moment(@props.start).format('HH:mm')+' - '+moment(@props.end).format('HH:mm')}
      </div>
      {@props.children}
    </div>
