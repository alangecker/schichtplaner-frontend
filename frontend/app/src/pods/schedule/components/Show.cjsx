React = require 'react'
Timetable = require 'react-timetable'
liquidFlux = require 'liquidFlux/frontend'
UserWidget = require '../../user/components/Widget'

ScheduleStore = require '../Store'
ShiftStore = require '../../shift/Store'
Shift = require './Shift'


module.exports = React.createClass
  mixins: [liquidFlux.mixin]
  displayName: 'ScheduleShow'

  getFluxStates: (props) ->
    schedule: ScheduleStore.getSchedule(props.params.scheduleId)
    shifts: ShiftStore.getShiftsByScheduleId(props.params.scheduleId)
  setStoreListener: -> [
      [ScheduleStore, @refreshFluxStates]
      [ShiftStore, @refreshFluxStates]
  ]
  render: ->
    return <div /> if not @state.schedule or not @state.schedule.id

    t = @state.schedule.title.split('/')
    if t.length > 1
      title = t[1]
    else
      title = t[0]

    <div className="content">
        {if true # TODO: moderator check
          <h4 className="header">
            {title}
            <a href="#/#{@props.params.event}/#{@state.schedule.id}/edit">bearbeiten</a>
          </h4>
        else
          <h4 className="header">{title}</h4>
        }
        <p style={{marginTop:'50px'}}/>
        <Timetable start={@state.schedule.start} end={@state.schedule.end}>
          {for shift in @state.shifts
              <Shift {...shift} key={shift.id}>
                <UserWidget id={shift.UserId} eventId={@state.schedule.eventId}>{shift.user}</UserWidget>

              </Shift>
          }
        </Timetable>
    </div>
