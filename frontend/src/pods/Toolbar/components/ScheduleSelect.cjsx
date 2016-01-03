React = require 'react'
ScheduleStore = require 'pods/schedule/Store'
liquidFlux = require 'liquidFlux/frontend'
DropDown = require 'react-materialform/common/DropDown'


module.exports = React.createClass
  displayName: 'ScheduleSelect'
  mixins: [liquidFlux.mixin]

  getFluxStates: (props)->
    events: ScheduleStore.getEvents()
    schedules: ScheduleStore.getSchedules(props.event)

  setStoreListener: -> [
      [ScheduleStore, @refreshFluxStates]
  ]

  render: ->
    eventPlaceholder = 'Jahr'
    eventOptions = []
    for t,event of @state.events
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
    groups = {}
    for id,schedule of @state.schedules
      if groups[schedule.group]
        groups[schedule.group].push schedule
      else
        groups[schedule.group] = [schedule]

    options = []
    placeholder = 'Schichtplan'

    for group,schedules of groups
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
