React = require 'react'
moment = require 'moment'

eventInRange = (event, range) ->
  return true if (event.start.isAfter(range.start) or event.start is range.start) && event.start.isBefore(range.end)
  return true if event.end.isAfter(range.start) && (event.end.isBefore(range.end) or event.end.isSame(range.end))
  return true if (range.start.isAfter(event.start) or range.start.isSame(event.start)) && range.start.isBefore(range.end) && (range.end.isBefore(event.end) or range.end.isSame(event.end))
  return false
  #
  # return true if event.start >= range.start and event.start < range.end
  # return true if event.end > range.start and event.end <= range.end
  # return true if range.start >= event.start and range.start < range.end and range.end <= event.end
  # return false

module.exports = React.createClass
  displayName: 'Events'

  contextTypes:
    getLineHeight: React.PropTypes.func

  getEvents: ->
    return [] unless @props.children
    events = []

    # # sort by start and duration
    # childs.sort (a,b) ->
    #   aStart = a.props.start.unix()
    #   bStart = b.props.start.unix()
    #   aEnd = a.props.end.unix()
    #   bEnd = b.props.end.unix()
    #
    #   diff =  aStart - bStart
    #   return diff if diff != 0
    #   durationA = aEnd-aStart
    #   durationB = bEnd-bStart
    #   return durationB-durationA

    for child in @props.children
      curEvent =
        start: moment(child.props.start)
        end: moment(child.props.end)
        component: React.cloneElement(child,
          hourHeight: @props.hourHeight
          gridStart: @props.start
          gridEnd: @props.end
        )


      curColumn = 0
      loop
        events[curColumn] = [] unless events[curColumn]
        collision = false

        for event in events[curColumn]
          if eventInRange(curEvent, event)
            collision = true
            break

        if collision
          curColumn++
        else
          events[curColumn].push curEvent
          break
    return events

  render: ->

    events = @getEvents()
    columnWidth = 100/events.length

    <div className="events col s10 m11 offset-s2 offset-m1">
      <div className="row">
        {for column,c in events
          <div key={c} className="col" style={{width:columnWidth+'%'}}>
              {for event,i in column
                style =
                  top: (event.start.diff(@props.start, 'm'))/60*@props.hourHeight + 'px'
                  height: (event.end.diff(event.start, 'm'))/60*@props.hourHeight + 'px'
                  width: columnWidth+'%'

                <div key={i} className={"event-container d#{event.end.diff(event.start, 'h')}h"} style={style}>{event.component}</div>
              }
              <div>&nbsp;</div>
          </div>
        }
      </div>
    </div>
