require './styles'

React = require 'react'
liquidFlux = require 'liquidFlux/frontend'
ScheduleStore = require 'pods/schedule/Store'
Toolbar = require 'pods/Toolbar/components/Toolbar'

module.exports = React.createClass
  displayName: 'App'
  mixins: [liquidFlux.mixin]

  setStoreListener: -> [
      [ScheduleStore, => @forceUpdate()]
  ]

  childContextTypes:
    dayThreshold: React.PropTypes.number

  getChildContext: ->
    dayThreshold: 6

  render: ->
    event = ScheduleStore.getActiveEvent(@props.params.event )
    scheduleId = parseInt @props.params.scheduleId
    <div id="app">
      <Toolbar event={event} scheduleId={scheduleId} />
      <div id="content">{@props.children}</div>
    </div>
