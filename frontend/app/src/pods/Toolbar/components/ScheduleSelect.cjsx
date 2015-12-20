React = require 'react'
ScheduleStore = require 'pods/schedule/Store'
liquidFlux = require 'liquidFlux'
DropDown = require 'react-materialform/common/DropDown'


module.exports = React.createClass
  displayName: 'ScheduleSelect'
  mixins: [liquidFlux.mixin]

  getFluxStates: ->
    events: ScheduleStore.getEvents()
    schedules: ScheduleStore.getSchedulesByGroups(@props.event)

  setStoreListener: -> [
      [ScheduleStore, @refreshFluxStates]
  ]

  render: ->
    eventPlaceholder = 'Jahr'
    eventOptions = []
    for event in @state.events
      eventOptions.push(href:'#/'+event.title, label:event.title)
      eventPlaceholder = @props.event if event.title == @props.event


    schedule = @groupsToOptions()

    # TODO: if UserStore.getLoggedin().moderator
    schedule.options.push
      href: "#/#{@props.event}/new"
      label: '+ Neuen Schichtplan'
      className: 'mod'

    <div className="schedule-selector">
      <DropDown
        id="event-selector"
        menu={eventOptions}
        className=""
        buttonText={eventPlaceholder}
        style={{width:80}} />
      <DropDown
        id="schedule-selector"
        menu={schedule.options}
        className=""
        buttonText={schedule.placeholder}
        style={{width:175}} />
    </div>



  # helpers
  # ------------------------------------

  groupsToOptions: ->
    options = []
    placeholder = 'Schichtplan'
    for group,schedules of @state.schedules
      options.push
        className: 'optgroup'
        disabled: true
        label: if group == '-' then 'Sonstige' else group
      for schedule in schedules
        title = schedule.title.split('/')
        title2 = if title.length > 1 then title[1] else title[0]
        options.push
          href: "#/#{@props.event}/#{schedule.id}"
          label: title2
        placeholder = title2 if schedule.id == @props.scheduleId

    return {options: options, placeholder: placeholder}
