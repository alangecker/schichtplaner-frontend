React = require 'react'
moment = require 'moment'
module.exports = React.createClass

  displayName: 'HourGridLine'

  click: (e) ->
    @props.onHourClick(@props.time) if @props.onHourClick


  render: ->
    dayThreshold = 4

    threshold = @props.count == 0 || (@props.time.hour() is dayThreshold && @props.count > dayThreshold)
    <div className={"line row"+(if threshold then ' threshold' else '')}>
      <div className={"hour col s2 m1"+(if @props.onHourClick then ' clickable' else '')} onClick={@click}>
        {if threshold
          @props.time.format('dddd')
        else
          @props.time.format('HH:mm')
        }
      </div>
      <div className="lin col s10 m11"></div>
    </div>
