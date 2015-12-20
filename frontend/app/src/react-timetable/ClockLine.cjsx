React = require 'react'
moment = require 'moment'


intervalMixin =
  intervals: []
  componentDidMount: ->
    for interval in @setIntervals()
      interval[0]()
      @intervals.push setInterval(interval[0], interval[1])
  componentWillUnmount: ->
    clearInterval(interval) for interval in @intervals


# Scroll to fix clockLine position
# window.scrollTo(0,$('.clock').offset().top-150)


module.exports = React.createClass
  mixins:[intervalMixin]
  setIntervals: -> [
    [@updateClockPosition, 60000]
  ]
  componentDidUpdate: -> @updateClockPosition()

  updateClockPosition: ->
    now = moment()
    element = $(@refs.clock)
    if now.isAfter(@props.start) && now.isBefore(@props.end)
      min = now.diff(@props.start, 'm')
      top = min/60*@props.hourHeight
      element.css
        top:"#{top}px"
        display:'block'
    else
      element.css
        top:"0px"
        display:'none'

  render: ->
    <div ref="clock" className="clock col s10 m11 offset-s2 offset-m1"><span /></div>
